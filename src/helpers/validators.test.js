import { COLORS, SHAPES } from "../constants";
import { validateFieldN1, validateFieldN2 } from "./validators";

const shapes = [SHAPES.CIRCLE, SHAPES.SQUARE, SHAPES.TRIANGLE, SHAPES.STAR];

const paintShapes = (colors) => {
  return shapes.reduce((accum, shape, i) => {
    accum[shape] = colors[i];
    return accum;
  }, {});
};

describe("N1 Красная звезда, зеленый квадрат, все остальные белые", () => {
  test("Если все цвета ок, то true", () => {
    const colors = [COLORS.WHITE, COLORS.GREEN, COLORS.WHITE, COLORS.RED];
    const shapes = paintShapes(colors);

    expect(validateFieldN1(shapes)).toBe(true);
  });
  test("звезда должна быть красная", () => {
    const colors = [COLORS.WHITE, COLORS.GREEN, COLORS.WHITE, COLORS.WHITE];
    const shapes = paintShapes(colors);

    expect(validateFieldN1(shapes)).toBe(false);
  });
  test("квадрат должен быть зелёный", () => {
    const colors = [COLORS.WHITE, COLORS.BLUE, COLORS.WHITE, COLORS.RED];
    const shapes = paintShapes(colors);

    expect(validateFieldN1(shapes)).toBe(false);
  });
  test("круг должен быть белый", () => {
    const colors = [COLORS.RED, COLORS.GREEN, COLORS.WHITE, COLORS.RED];
    const shapes = paintShapes(colors);

    expect(validateFieldN1(shapes)).toBe(false);
  });
  test("треугольник должен быть белый", () => {
    const colors = [COLORS.WHITE, COLORS.GREEN, COLORS.GREEN, COLORS.RED];
    const shapes = paintShapes(colors);

    expect(validateFieldN1(shapes)).toBe(false);
  });
});

describe("N2  Как минимум две фигуры зеленые", () => {
  test("4 зелёных", () => {
    const colors = [COLORS.GREEN, COLORS.GREEN, COLORS.GREEN, COLORS.GREEN];
    const shapes = paintShapes(colors);

    expect(validateFieldN2(shapes)).toBe(true);
  });
  test("3 зелёных и белая", () => {
    const colors = [COLORS.GREEN, COLORS.GREEN, COLORS.WHITE, COLORS.GREEN];
    const shapes = paintShapes(colors);

    expect(validateFieldN2(shapes)).toBe(true);
  });
  test("3 зелёных и красная", () => {
    const colors = [COLORS.RED, COLORS.GREEN, COLORS.GREEN, COLORS.GREEN];
    const shapes = paintShapes(colors);

    expect(validateFieldN2(shapes)).toBe(true);
  });
  test("2 зелёных и 2 красных", () => {
    const colors = [COLORS.RED, COLORS.RED, COLORS.GREEN, COLORS.GREEN];
    const shapes = paintShapes(colors);

    expect(validateFieldN2(shapes)).toBe(true);
  });
  test("1 зелёная, 1 синяя и 2 красных", () => {
    const colors = [COLORS.RED, COLORS.BLUE, COLORS.GREEN, COLORS.RED];
    const shapes = paintShapes(colors);

    expect(validateFieldN2(shapes)).toBe(false);
  });
  test("0 зелёная, 2 синяя и 2 красных", () => {
    const colors = [COLORS.BLUE, COLORS.BLUE, COLORS.RED, COLORS.RED];
    const shapes = paintShapes(colors);

    expect(validateFieldN2(shapes)).toBe(false);
  });
});
