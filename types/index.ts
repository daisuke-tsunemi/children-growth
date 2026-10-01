import { z } from 'zod';

/**
 * microCMSの画像フィールド共通形式。
 */
export const microCMSImageSchema = z.object({
  url: z.string(),
  height: z.number().optional(),
  width: z.number().optional(),
});
export type MicroCMSImage = z.infer<typeof microCMSImageSchema>;

/**
 * microCMSのセレクトフィールド(単一選択)は`multipleSelect: false`でも配列(`string[]`)で返る。
 * 必須フィールドは要素数1の配列を単一値へ、任意フィールドは0〜1件の配列を`値 | undefined`へ変換する。
 * 引数には素の選択肢`z.enum(...)`を渡す(URLクエリ等、配列化されない場面でも同じ選択肢定義を再利用するため)。
 */
function requiredSingleSelect<T extends z.ZodEnum<Record<string, string>>>(schema: T) {
  return z.array(schema).length(1).transform((arr) => arr[0]);
}
function optionalSingleSelect<T extends z.ZodEnum<Record<string, string>>>(schema: T) {
  return z.array(schema).max(1).optional().transform((arr) => arr?.[0]);
}

/**
 * microCMSのリスト形式コンテンツが共通で持つフィールド。
 */
const microCMSBaseSchema = z.object({
  id: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  publishedAt: z.string(),
  revisedAt: z.string(),
});

/**
 * `gender`の選択肢。microCMSのセレクト値と完全一致させる。
 */
export const genderSchema = z.enum(['男の子', '女の子', '未設定']);
export type Gender = z.infer<typeof genderSchema>;

/**
 * `children`(子どもプロフィール)。
 * `microcms-schema.md` 1.children に対応。
 */
export const childSchema = microCMSBaseSchema.extend({
  name: z.string().min(1).max(30),
  birthday: z.string(),
  gender: optionalSingleSelect(genderSchema),
  photo: microCMSImageSchema.optional(),
  memo: z.string().optional(),
});
export type Child = z.infer<typeof childSchema>;

/**
 * `measurements`(からだの成長)。
 * `microcms-schema.md` 2.measurements に対応。
 * アプリ検証: height / weight / headCircumference の少なくとも1つは必須。
 * weightの下限は1.0kg(2026-10-01決定。新生児・早産児も登録できるようmicroCMS側の5kgより引き下げる)。
 */
export const measurementSchema = microCMSBaseSchema
  .extend({
    child: childSchema,
    measuredAt: z.string(),
    height: z.number().min(1).max(250).optional(),
    weight: z.number().min(1.0).max(100).optional(),
    headCircumference: z.number().min(1).max(100).optional(),
    note: z.string().optional(),
  })
  .refine(
    (value) => value.height !== undefined || value.weight !== undefined || value.headCircumference !== undefined,
    { message: '身長・体重・頭囲のいずれかが必要です' },
  );
export type Measurement = z.infer<typeof measurementSchema>;

/**
 * `vaccine`の選択肢。microCMSのセレクト値(`microcms-template.json`)と完全一致させる。
 * `constants/vaccines.ts`のキーもこの値と一致させること。
 */
export const vaccineTypeSchema = z.enum([
  '5種混合（百日せき・ジフテリア・破傷風・ポリオ・Hib）',
  '小児用肺炎球菌',
  'B型肝炎',
  'ロタウイルス',
  'BCG（結核）',
  'MR（麻しん・風しん混合）',
  '水痘（水ぼうそう）',
  '日本脳炎',
  'MR 2期（麻しん・風しんの追加）',
  'DT（2種混合）：ジフテリア・破傷風（11歳〜12歳）',
  'HPV（ヒトパピローマウイルス感染症／子宮頸がん予防）',
  'その他',
]);
export type VaccineType = z.infer<typeof vaccineTypeSchema>;

/**
 * `vaccinations`(予防接種の記録)。
 * `microcms-schema.md` 3.vaccinations に対応。
 * アプリ検証: 接種済(status=true)なら vaccinatedAt が必須。
 */
export const vaccinationSchema = microCMSBaseSchema
  .extend({
    child: childSchema,
    vaccine: requiredSingleSelect(vaccineTypeSchema),
    doseCount: z.number().min(1).max(10),
    status: z.boolean(),
    vaccinatedAt: z.string().optional(),
    clinic: z.string().max(20).optional(),
    reaction: z.string().optional(),
    note: z.string().optional(),
  })
  .refine((value) => !value.status || value.vaccinatedAt !== undefined, {
    message: '接種済の場合は接種日が必要です',
    path: ['vaccinatedAt'],
  });
export type Vaccination = z.infer<typeof vaccinationSchema>;

/**
 * `category`の選択肢。microCMSのセレクト値と完全一致させる。
 */
export const dailyCategorySchema = z.enum(['からだ', 'ことば', '食べ物', '生活', 'おでかけ', '行事', 'その他']);
export type DailyCategory = z.infer<typeof dailyCategorySchema>;

/**
 * `mood`の選択肢。
 */
export const dailyMoodSchema = z.enum(['良い', 'ふつう', '悪い']);
export type DailyMood = z.infer<typeof dailyMoodSchema>;

/**
 * `daily`(日々の記録)。
 * `microcms-schema.md` 4.daily に対応。日付フィールドを持たず、記録日は`createdAt`を使う。
 */
export const dailySchema = microCMSBaseSchema.extend({
  child: childSchema,
  category: requiredSingleSelect(dailyCategorySchema),
  note: z.string().min(1),
  mood: optionalSingleSelect(dailyMoodSchema),
  photos: z.array(microCMSImageSchema).optional(),
  temperature: z.number().min(30).max(50).optional(),
});
export type Daily = z.infer<typeof dailySchema>;

/**
 * microCMSのリストAPIレスポンス共通形式。
 */
export function microCMSListSchema<T extends z.ZodTypeAny>(itemSchema: T) {
  return z.object({
    contents: z.array(itemSchema),
    totalCount: z.number(),
    limit: z.number(),
    offset: z.number(),
  });
}
