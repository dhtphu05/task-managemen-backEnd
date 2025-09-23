export type ApiSuccess<T> = { success: true; data: T };
export type ApiError = { success: false; error: { message: string } };

export const ok = <T>(data: T): ApiSuccess<T> => ({ success: true, data });
export const fail = (message: string): ApiError => ({ success: false, error: { message } });
