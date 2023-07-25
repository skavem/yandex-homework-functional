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
  applySpec,
  binary,
  call,
  converge,
  curry,
  evolve,
  flip,
  gt,
  gte,
  identity,
  ifElse,
  length,
  lensPath,
  lensProp,
  lt,
  modulo,
  not,
  otherwise,
  over,
  path,
  pipe,
  prop,
  set,
  tap,
  test,
} from "ramda";

const api = new Api();

const tryCatchPromisified = curry(async (fn, handle, obj) => {
  try {
    return await fn(obj);
  } catch (e) {
    return handle(e, obj);
  }
});
const errorToPromise = (error, context) => Promise.reject({ error, context })
const errorToPromiseWithContext = (error, {context}) => Promise.reject({ error, context })

const turnNumberBase10To2 = tryCatchPromisified(
  async (context) => ({
    ...(await api.get("https://api.tech/numbers/base", {
      from: 10,
      to: 2,
      number: context.value,
    })),
    context,
  }),
  errorToPromise
);

const getRandomAnimal = tryCatchPromisified(
  async ({ context, result: id }) => ({
    ...(await api.get("https://animals.tech/" + id, {})),
    context,
  }),
  errorToPromiseWithContext
);

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
  getFunctionAndCallWith([handleErrorInContext, prop("error")])
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

export default processSequence;
