import { refreshTokens } from 'database/schema';
import { InferInsertModel, InferSelectModel } from 'drizzle-orm';
export type RefreshToken = InferSelectModel<typeof refreshTokens>;

export type CreateRefreshToken = InferInsertModel<typeof refreshTokens>;
