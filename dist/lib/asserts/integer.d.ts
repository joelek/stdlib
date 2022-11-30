export declare class IntegerAssert {
    private constructor();
    static atLeast(min: number, value: number): number;
    static atMost(max: number, value: number): number;
    static between(min: number, value: number, max: number): number;
    static exactly(value: number, expected: number): number;
    static integer(value: number): number;
}
