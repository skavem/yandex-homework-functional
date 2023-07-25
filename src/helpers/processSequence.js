/* eslint-disable react-hooks/rules-of-hooks */
/**
 * @file Домашка по FP ч. 2
 *
 * Подсказки:
 * Метод get у инстанса Api – каррированый
 * GET / https://animals.tech/{id}
 *
 * GET / https://api.tech/numbers/base
 * params:
 * – number [Int] – число
 * – from [Int] – из какой системы счисления
 * – to [Int] – в какую систему счисления
 *
 * Иногда промисы от API будут приходить в состояние rejected, (прямо как и API в реальной жизни)
 * Ответ будет приходить в поле {result}
 */
import Api from "../tools/api";

import {
  __,
  allPass,
  andThen,
  binary,
  call,
  converge,
  evolve,
  flip,
  gt,
  gte,
  ifElse,
  length,
  lensPath,
  lt,
  modulo,
  not,
  otherwise,
  over,
  path,
  pipe,
  prop,
  tap,
  test,
} from "ramda";

const api = new Api();

// Берем строку N. Пишем изначальную строку в writeLog.
// Строка валидируется по следующим правилам:
// 		кол-во символов в числе должно быть меньше 10.
// 		кол-во символов в числе должно быть больше 2.
// 		число должно быть положительным
// 		символы в строке только [0-9] и точка т.е. число в 10-ной системе счисления (возможно с плавающей запятой)
// В случае ошибки валидации вызвать handleError с 'ValidationError' строкой в качестве аргумента
// Привести строку к числу, округлить к ближайшему целому с точностью до единицы, записать в writeLog.
// C помощью API /numbers/base перевести из 10-й системы счисления в двоичную, результат записать в writeLog
// Взять кол-во символов в полученном от API числе записать в writeLog
// Возвести в квадрат с помощью Javascript записать в writeLog
// Взять остаток от деления на 3, записать в writeLog
// C помощью API /animals.tech/id/name получить случайное животное используя полученный остаток в качестве id
// Завершить цепочку вызовом handleSuccess в который в качестве аргумента положить результат полученный на предыдущем шаге

// const processSequence = ({ value, writeLog, handleSuccess, handleError }) => {};

console.clear();

class FetchError extends Error {
  constructor(message, context) {
    super(message);
    this.context = context;
  }
}

const turnNumberBase10To2 = async (context) => {
  try {
    return {
      ...(await api.get("https://api.tech/numbers/base", {
        from: 10,
        to: 2,
        number: context.value,
      })),
      context,
    };
  } catch (error) {
    throw new FetchError(error, context);
  }
};

const getRandomAnimal = async ({ context, result }) => {
  try {
    return {
      ...(await api.get("https://animals.tech/" + result, {})),
      context,
    };
  } catch (error) {
    throw new FetchError(error, context);
  }
};

const toModulo3 = modulo(__, 3);
const toPow2 = flip(Math.pow)(2);

const getFunctionAndCallWith = converge(call);

const writeValueToLog = tap(
  getFunctionAndCallWith([prop("writeLog"), prop("value")])
);
const writeLogInContext = path(["context", "writeLog"]);
const writeResultToLog = tap(
  getFunctionAndCallWith([writeLogInContext, prop("result")])
);

const callWithValidationError = flip(binary(call))("ValidationError");
const onInvalidNumber = pipe(prop("handleError"), callWithValidationError);
const isNumberValid = allPass([
  pipe(prop("value"), test(/[^0-9.]+/), not),
  pipe(prop("value"), Number, gte(__, 0)),
  pipe(prop("value"), length, lt(__, 10)),
  pipe(prop("value"), length, gt(__, 2)),
]);

const handleErrorInContext = path(["context", "handleError"]);
const onFetchError = otherwise(
  getFunctionAndCallWith([handleErrorInContext, prop("message")])
);

const handleSuccessInContext = path(["context", "handleSuccess"]);
const onGetRandomAnimalSuccess = andThen(
  getFunctionAndCallWith([handleSuccessInContext, prop("result")])
);
const onGetRandomAnimalError = onFetchError;

const toRoundedNumber = pipe(Number, Math.round);
const valueToRoundedNumber = evolve({
  value: toRoundedNumber,
});
const updateWithLength = over(lensPath(["result"]), length);
const updateWithPower2 = over(lensPath(["result"]), toPow2);
const updateWithModulo3 = over(lensPath(["result"]), toModulo3);
const onTurnNumberSuccess = andThen(
  pipe(
    writeResultToLog,
    updateWithLength,
    writeResultToLog,
    updateWithPower2,
    writeResultToLog,
    updateWithModulo3,
    writeResultToLog,

    getRandomAnimal,
    onGetRandomAnimalSuccess,
    onGetRandomAnimalError
  )
);
const onTurnNumberError = onFetchError;

const onValidNumber = pipe(
  valueToRoundedNumber,
  writeValueToLog,

  turnNumberBase10To2,
  onTurnNumberSuccess,
  onTurnNumberError
);

const processSequence = pipe(
  writeValueToLog,

  ifElse(isNumberValid, onValidNumber, onInvalidNumber)
);

console.log("------------");
processSequence({
  value: "111",
  writeLog: console.log,
  handleSuccess: console.log,
  handleError: console.error,
});
console.log("------------");
processSequence({
  value: "3",
  writeLog: console.log,
  handleSuccess: console.log,
  handleError: console.error,
});

export default processSequence;
