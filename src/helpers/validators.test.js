import { describe, expect } from "@jest/globals";
import { COLORS, SHAPES } from "../constants";
import {
  validateFieldN1,
  validateFieldN2,
  validateFieldN3,
  validateFieldN4,
  validateFieldN5,
  validateFieldN6,
  validateFieldN7,
  validateFieldN8,
  validateFieldN9,
} from "./validators";

const shapes = [SHAPES.CIRCLE, SHAPES.SQUARE, SHAPES.TRIANGLE, SHAPES.STAR];

const paintShapes = (colors) => {
  return shapes.reduce((accum, shape, i) => {
    accum[shape] = colors[i];
    return accum;
  }, {});
};

describe("1 Красная звезда, зеленый квадрат, все остальные белые", () => {
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

describe("2  Как минимум две фигуры зеленые", () => {
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

describe("3. Количество красных фигур равно кол-ву синих.", () => {
  it("True если 2 красных и 2 синих", () => {
    const shapes = {
      [SHAPES.TRIANGLE]: COLORS.RED,
      [SHAPES.SQUARE]: COLORS.RED,
      [SHAPES.CIRCLE]: COLORS.BLUE,
      [SHAPES.STAR]: COLORS.BLUE,
    };

    expect(validateFieldN3(shapes)).toBe(true);
  });

  it("True если 1 красная и 1 синяя", () => {
    const shapes = {
      [SHAPES.TRIANGLE]: COLORS.RED,
      [SHAPES.SQUARE]: COLORS.GREEN,
      [SHAPES.CIRCLE]: COLORS.GREEN,
      [SHAPES.STAR]: COLORS.BLUE,
    };

    expect(validateFieldN3(shapes)).toBe(true);
  });

  it("True если 0 красных и 0 синих", () => {
    const shapes = {
      [SHAPES.TRIANGLE]: COLORS.ORANGE,
      [SHAPES.SQUARE]: COLORS.GREEN,
      [SHAPES.CIRCLE]: COLORS.GREEN,
      [SHAPES.STAR]: COLORS.WHITE,
    };

    expect(validateFieldN3(shapes)).toBe(true);
  });

  it("False если 1 красная и 0 синих", () => {
    const shapes = {
      [SHAPES.TRIANGLE]: COLORS.ORANGE,
      [SHAPES.SQUARE]: COLORS.ORANGE,
      [SHAPES.CIRCLE]: COLORS.ORANGE,
      [SHAPES.STAR]: COLORS.RED,
    };

    expect(validateFieldN3(shapes)).toBe(false);
  });

  it("False если 1 красная и 2 синих", () => {
    const shapes = {
      [SHAPES.TRIANGLE]: COLORS.BLUE,
      [SHAPES.SQUARE]: COLORS.BLUE,
      [SHAPES.CIRCLE]: COLORS.ORANGE,
      [SHAPES.STAR]: COLORS.RED,
    };

    expect(validateFieldN3(shapes)).toBe(false);
  });
});

describe("4. Синий круг, красная звезда, оранжевый квадрат треугольник любого цвета", () => {
  it("True если синий круг, красная звезда, оранжевый квадрат и белый треугольник", () => {
    const shapes = {
      [SHAPES.TRIANGLE]: COLORS.WHITE,
      [SHAPES.SQUARE]: COLORS.ORANGE,
      [SHAPES.CIRCLE]: COLORS.BLUE,
      [SHAPES.STAR]: COLORS.RED,
    };

    expect(validateFieldN4(shapes)).toBe(true);
  });

  it("False если круг красный", () => {
    const shapes = {
      [SHAPES.TRIANGLE]: COLORS.WHITE,
      [SHAPES.SQUARE]: COLORS.ORANGE,
      [SHAPES.CIRCLE]: COLORS.RED,
      [SHAPES.STAR]: COLORS.RED,
    };

    expect(validateFieldN4(shapes)).toBe(false);
  });

  it("False если звезда оранжевая", () => {
    const shapes = {
      [SHAPES.TRIANGLE]: COLORS.WHITE,
      [SHAPES.SQUARE]: COLORS.ORANGE,
      [SHAPES.CIRCLE]: COLORS.BLUE,
      [SHAPES.STAR]: COLORS.ORANGE,
    };

    expect(validateFieldN4(shapes)).toBe(false);
  });
});

describe("5. Три фигуры одного любого цвета кроме белого (четыре фигуры одного цвета – это тоже true).", () => {
  it("True если 3 фигуры синие", () => {
    const colors = [COLORS.BLUE, COLORS.BLUE, COLORS.BLUE, COLORS.RED];
    const shapes = paintShapes(colors);

    expect(validateFieldN5(shapes)).toBe(true);
  });

  it("True если 3 фигуры зеленые", () => {
    const colors = [COLORS.GREEN, COLORS.GREEN, COLORS.GREEN, COLORS.RED];
    const shapes = paintShapes(colors);

    expect(validateFieldN5(shapes)).toBe(true);
  });

  it("True если 4 фигуры синие", () => {
    const colors = [COLORS.BLUE, COLORS.BLUE, COLORS.BLUE, COLORS.BLUE];
    const shapes = paintShapes(colors);

    expect(validateFieldN5(shapes)).toBe(true);
  });

  it("False если 2 только фигуры синие", () => {
    const colors = [COLORS.BLUE, COLORS.BLUE, COLORS.RED, COLORS.GREEN];
    const shapes = paintShapes(colors);

    expect(validateFieldN5(shapes)).toBe(false);
  });

  it("False если 3 фигуры белые", () => {
    const colors = [COLORS.WHITE, COLORS.WHITE, COLORS.WHITE, COLORS.RED];
    const shapes = paintShapes(colors);

    expect(validateFieldN5(shapes)).toBe(false);
  });

  it("False если 4 фигуры белые", () => {
    const colors = [COLORS.WHITE, COLORS.WHITE, COLORS.WHITE, COLORS.RED];
    const shapes = paintShapes(colors);

    expect(validateFieldN5(shapes)).toBe(false);
  });
});

describe("6. Ровно две зеленые фигуры (одна из зелёных – это треугольник), плюс одна красная. Четвёртая оставшаяся любого доступного цвета, но не нарушающая первые два условия", () => {
  it("True если 2 зеленых (треугольник и квадрат) и 1 красная (круг)", () => {
    const shapes = {
      [SHAPES.TRIANGLE]: COLORS.GREEN,
      [SHAPES.SQUARE]: COLORS.GREEN,
      [SHAPES.CIRCLE]: COLORS.RED,
      [SHAPES.STAR]: COLORS.BLUE,
    };

    expect(validateFieldN6(shapes)).toBe(true);
  });

  it("True если 2 зеленых (треугольник и круг) и 1 красная (квадрат)", () => {
    const shapes = {
      [SHAPES.TRIANGLE]: COLORS.GREEN,
      [SHAPES.SQUARE]: COLORS.RED,
      [SHAPES.CIRCLE]: COLORS.GREEN,
      [SHAPES.STAR]: COLORS.BLUE,
    };

    expect(validateFieldN6(shapes)).toBe(true);
  });

  it("False если только 1 зеленая", () => {
    const shapes = {
      [SHAPES.TRIANGLE]: COLORS.GREEN,
      [SHAPES.SQUARE]: COLORS.BLUE,
      [SHAPES.CIRCLE]: COLORS.RED,
      [SHAPES.STAR]: COLORS.BLUE,
    };

    expect(validateFieldN6(shapes)).toBe(false);
  });

  it("False если 2 зеленых (круг и квадрат)", () => {
    const shapes = {
      [SHAPES.TRIANGLE]: COLORS.RED,
      [SHAPES.SQUARE]: COLORS.GREEN,
      [SHAPES.CIRCLE]: COLORS.GREEN,
      [SHAPES.STAR]: COLORS.BLUE,
    };

    expect(validateFieldN6(shapes)).toBe(false);
  });
});

describe("7. Все фигуры оранжевые", () => {
  it("True если все оранжевые", () => {
    const shapes = {
      [SHAPES.TRIANGLE]: COLORS.ORANGE,
      [SHAPES.SQUARE]: COLORS.ORANGE,
      [SHAPES.CIRCLE]: COLORS.ORANGE,
      [SHAPES.STAR]: COLORS.ORANGE,
    };

    expect(validateFieldN7(shapes)).toBe(true);
  });

  it("False если три оранжевые, одна красная", () => {
    const shapes = {
      [SHAPES.TRIANGLE]: COLORS.ORANGE,
      [SHAPES.SQUARE]: COLORS.ORANGE,
      [SHAPES.CIRCLE]: COLORS.ORANGE,
      [SHAPES.STAR]: COLORS.RED,
    };

    expect(validateFieldN7(shapes)).toBe(false);
  });

  it("False если ни одна не оранжевая", () => {
    const shapes = {
      [SHAPES.TRIANGLE]: COLORS.ORANGE,
      [SHAPES.SQUARE]: COLORS.ORANGE,
      [SHAPES.CIRCLE]: COLORS.ORANGE,
      [SHAPES.STAR]: COLORS.RED,
    };

    expect(validateFieldN7(shapes)).toBe(false);
  });
});

describe("8. Не красная и не белая звезда, остальные – любого цвета", () => {
  it("True если звезда синяя", () => {
    const shapes = {
      [SHAPES.TRIANGLE]: COLORS.GREEN,
      [SHAPES.SQUARE]: COLORS.GREEN,
      [SHAPES.CIRCLE]: COLORS.GREEN,
      [SHAPES.STAR]: COLORS.BLUE,
    };

    expect(validateFieldN8(shapes)).toBe(true);
  });

  it("False если звезда красная", () => {
    const shapes = {
      [SHAPES.TRIANGLE]: COLORS.GREEN,
      [SHAPES.SQUARE]: COLORS.GREEN,
      [SHAPES.CIRCLE]: COLORS.GREEN,
      [SHAPES.STAR]: COLORS.RED,
    };

    expect(validateFieldN8(shapes)).toBe(false);
  });

  it("False если звезда белая", () => {
    const shapes = {
      [SHAPES.TRIANGLE]: COLORS.GREEN,
      [SHAPES.SQUARE]: COLORS.GREEN,
      [SHAPES.CIRCLE]: COLORS.GREEN,
      [SHAPES.STAR]: COLORS.WHITE,
    };

    expect(validateFieldN8(shapes)).toBe(false);
  });
});

describe("9. Все фигуры зеленые", () => {
  it("True если все зеленые", () => {
    const shapes = {
      [SHAPES.TRIANGLE]: COLORS.GREEN,
      [SHAPES.SQUARE]: COLORS.GREEN,
      [SHAPES.CIRCLE]: COLORS.GREEN,
      [SHAPES.STAR]: COLORS.GREEN,
    };

    expect(validateFieldN9(shapes)).toBe(true);
  });

  it("False если три зеленые, одна красная", () => {
    const shapes = {
      [SHAPES.TRIANGLE]: COLORS.GREEN,
      [SHAPES.SQUARE]: COLORS.GREEN,
      [SHAPES.CIRCLE]: COLORS.GREEN,
      [SHAPES.STAR]: COLORS.RED,
    };

    expect(validateFieldN9(shapes)).toBe(false);
  });
});

describe("10. Треугольник и квадрат одного цвета (не белого), остальные – любого цвета", () => {
  it("True если треугольник и квадрат зеленые", () => {
    const shapes = {
      [SHAPES.TRIANGLE]: COLORS.GREEN,
      [SHAPES.SQUARE]: COLORS.GREEN,
      [SHAPES.CIRCLE]: COLORS.GREEN,
      [SHAPES.STAR]: COLORS.GREEN,
    };

    expect(validateFieldN9(shapes)).toBe(true);
  });

  it("False если треугольник и квадрат белые", () => {
    const shapes = {
      [SHAPES.TRIANGLE]: COLORS.WHITE,
      [SHAPES.SQUARE]: COLORS.WHITE,
      [SHAPES.CIRCLE]: COLORS.GREEN,
      [SHAPES.STAR]: COLORS.RED,
    };

    expect(validateFieldN9(shapes)).toBe(false);
  });

  it("False если треугольник красный, а квадрат белый", () => {
    const shapes = {
      [SHAPES.TRIANGLE]: COLORS.RED,
      [SHAPES.SQUARE]: COLORS.WHITE,
      [SHAPES.CIRCLE]: COLORS.GREEN,
      [SHAPES.STAR]: COLORS.RED,
    };

    expect(validateFieldN9(shapes)).toBe(false);
  });
});
