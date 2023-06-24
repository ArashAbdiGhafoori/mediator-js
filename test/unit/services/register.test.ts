import Container from "../../../src/container";
import evma from "../../../src/main";
import Service from "../../../src/types/di/service";

let container: Container;
let counter = 0;
beforeEach(() => {
  container = evma.container(`${counter++}`, true);
});

test("singleton should register", () => {
  const serviceName = "ServiceName";
  const expected = "ServiceTest";
  const serviceInstance = { test: expected };
  container.register.service({
    name: serviceName,
    life: "Singleton",
    instance: serviceInstance,
  });

  const actual = container["items"].get(serviceName) as Service<{
    test: string;
  }>;
  expect(actual).toBeDefined();
  expect(actual.instance).toBeDefined();
  expect(actual.instance?.test).toBe(expected);
});

test("transient should register", () => {
  const serviceName = "ServiceName";
  const expected = "ServiceTest";
  container.register.service<Service<string>, string>({
    name: serviceName,
    life: "Transient",
    factory() {
      return expected;
    },
  });

  const actual = container["items"].get(serviceName) as Service<{
    test: string;
  }>;
  expect(actual).toBeDefined();
  expect(actual.factory).toBeDefined();
  if (actual.factory) {
    expect(actual.factory()).toBeDefined();
    expect(actual.factory()).toBe(expected);
  }
});

test("singleton-transient should register", () => {
  const serviceName = "ServiceName";
  const expected = "ServiceTest";
  const serviceInstance = { test: expected };
  container.register.service({
    name: serviceName,
    life: "Both",
    instance: serviceInstance,
    factory() {
      return { test: expected };
    },
  });

  const actual = container["items"].get(serviceName) as Service<{
    test: string;
  }>;
  
  expect(actual).toBeDefined();
  expect(actual.instance).toBeDefined();
  expect(actual.instance?.test).toBe(expected);

  expect(actual.factory).toBeDefined();
  if (actual.factory) expect(actual.factory().test).toBe(expected);
});
