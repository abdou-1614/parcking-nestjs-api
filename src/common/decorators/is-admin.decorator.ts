import { SetMetadata, UseGuards, applyDecorators } from "@nestjs/common"
import { RoleGuard } from "../guards/role.guard"
import { ApiBearerAuth, ApiForbiddenResponse, ApiUnauthorizedResponse } from "@nestjs/swagger"


export const IS_ADMIN_KEY = 'isAdmin'

export function IsAdmin(): <T> (
    target: object | T,
    propertyKey?: string | symbol
) => void {
    return applyDecorators(
        SetMetadata(IS_ADMIN_KEY, true),
        UseGuards(RoleGuard),
        ApiBearerAuth(),
        ApiUnauthorizedResponse({ description: 'UNAUTHORIZED' }),
        ApiForbiddenResponse({ description: 'Forbidden resource' })
    )
}