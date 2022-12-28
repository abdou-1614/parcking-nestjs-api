import { ApiPropertyOptions, ApiProperty } from "@nestjs/swagger";

export const ApiFile = (options?: ApiPropertyOptions): PropertyDecorator => (
    target: Object,
    preopertyKey?: string | symbol
) => {
    ApiProperty({
        type: 'file',
        properties: {
            [preopertyKey]: {
                type: 'string',
                format: 'binary'
            }
        }
    })(target, preopertyKey)
}