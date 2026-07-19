export type ActionResult<T = void> = {
  success: boolean;
  data?: T;
  error?: string;
};

export function actionSuccess<T>(data?: T): ActionResult<T> {
  return { success: true, data };
}

export function actionError(error: unknown): ActionResult<never> {
  if (error instanceof Error) {
    return { success: false, error: error.message };
  }
  return { success: false, error: "Something went wrong" };
}
