export type ApiSuccess<T> = {
    success: true;
    data: T;
};
export type ApiError = {
    success: false;
    error: {
        message: string;
    };
};
export declare const ok: <T>(data: T) => ApiSuccess<T>;
export declare const fail: (message: string) => ApiError;
//# sourceMappingURL=http.d.ts.map