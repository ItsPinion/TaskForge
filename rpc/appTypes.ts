import type { userRoute } from "../backend/src/index.ts";
import type { taskRoute } from "../backend/src/index.ts";

export type userAppType = typeof userRoute;
export type taskAppType = typeof taskRoute;
