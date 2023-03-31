import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { IS_ADMIN_KEY } from "../decorators/is-admin.decorator";
import { ACCOUNT_ROLE } from "src/constants/account.constant";

@Injectable()
export class RoleGuard implements CanActivate {
    constructor( private reflector: Reflector ){}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const isAdmin = this.reflector.getAllAndOverride(IS_ADMIN_KEY, [
            context.getClass(),
            context.getHandler()
        ])

        const request = context.switchToHttp().getRequest()

        const {userRole} = request.user
        if(isAdmin && userRole === ACCOUNT_ROLE.ADMIN){
            return true
        }

        return false
    }
}