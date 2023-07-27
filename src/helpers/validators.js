/* eslint-disable react-hooks/rules-of-hooks */
/**
 * @file Домашка по FP ч. 1
 *
 * Основная задача — написать самому, или найти в FP библиотеках функции anyPass/allPass
 * Эти функции/их аналоги есть и в ramda и в lodash
 *
 * allPass — принимает массив функций-предикатов, и возвращает функцию-предикат, которая
 * вернет true для заданного списка аргументов, если каждый из предоставленных предикатов
 * удовлетворяет этим аргументам (возвращает true)
 *
 * anyPass — то же самое, только удовлетворять значению может единственная функция-предикат из массива.
 *
 * Если какие либо функции написаны руками (без использования библиотек) это не является ошибкой
 */

import {
  __,
  allPass,
  any,
  compose,
  converge,
  count,
  countBy,
  equals,
  flip,
  gte,
  identity,
  length,
  not,
  omit,
  pipe,
  prop,
  useWith,
  values
} from "ramda";

const isOfColor = equals;
const isFigureOfColor = useWith(pipe, [prop, isOfColor]);
const countByColor = (color) => compose(count(isOfColor(color)), values);
const countByIdentity = countBy(identity);
const countAllColors = compose(countByIdentity, values);
const countAllFigures = compose(length, values);
const isMoreThan = flip(gte);

// 1. Красная звезда, зеленый квадрат, все остальные белые.
export const validateFieldN1 = allPass([
  isFigureOfColor("star")("red"),
  isFigureOfColor("square")("green"),
  isFigureOfColor("triangle")("white"),
  isFigureOfColor("circle")("white"),
]);

// 2. Как минимум две фигуры зеленые.
const countGreen = countByColor("green");
const moreThanOrEqual2 = flip(gte)(2);
export const validateFieldN2 = compose(moreThanOrEqual2, countGreen);

// 3. Количество красных фигур равно кол-ву синих.
const countRed = countByColor("red");
const countBlue = countByColor("blue");
export const validateFieldN3 = converge(equals, [countRed, countBlue]);

// 4. Синий круг, красная звезда, оранжевый квадрат треугольник любого цвета
export const validateFieldN4 = allPass([
  isFigureOfColor("circle")("blue"),
  isFigureOfColor("star")("red"),
  isFigureOfColor("square")("orange"),
]);

// 5. Три фигуры одного любого цвета кроме белого (четыре фигуры одного цвета – это тоже true).
const countColorsExceptWhite = compose(values, omit(["white"]), countAllColors);
const hasAnyColorMoreThanThreeFigures = any(isMoreThan(3));
export const validateFieldN5 = compose(
  hasAnyColorMoreThanThreeFigures,
  countColorsExceptWhite
);

// 6. Ровно две зеленые фигуры (одна из зелёных – это треугольник), плюс одна красная. Четвёртая оставшаяся любого доступного цвета, но не нарушающая первые два условия
const onlyTwoGreen = compose(equals(2), countGreen);
const onlyOneRed = compose(equals(1), countRed);
export const validateFieldN6 = allPass([
  onlyTwoGreen,
  isFigureOfColor("triangle")("green"),
  onlyOneRed,
]);

// 7. Все фигуры оранжевые.
const countOrange = countByColor("orange");
export const validateFieldN7 = converge(equals, [countAllFigures, countOrange]);

// 8. Не красная и не белая звезда, остальные – любого цвета.
export const validateFieldN8 = allPass([
  compose(not, isFigureOfColor("star")("red")),
  compose(not, isFigureOfColor("star")("white")),
]);

// 9. Все фигуры зеленые.
export const validateFieldN9 = converge(equals, [countAllFigures, countGreen]);

// 10. Треугольник и квадрат одного цвета (не белого), остальные – любого цвета
const areSquareAndTriangleOfOneColor = converge(equals, [prop("triangle"), prop("square")])
export const validateFieldN10 = allPass([
  compose(not, isFigureOfColor("square")("white")),
  compose(not, isFigureOfColor("triangle")("white")),
  areSquareAndTriangleOfOneColor,
]);
