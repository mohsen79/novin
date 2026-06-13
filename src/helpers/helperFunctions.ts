import type { Average } from "../types/form.types";

export const getSum = (average: Average) => Object.values(average).reduce((acc, cur) => acc + cur, 0);