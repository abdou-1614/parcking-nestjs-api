import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs'

@Injectable()
export class FileUploadBodyInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {

        const req = context.switchToHttp().getRequest()

        if( req.body && req.file?.fieldname ) {
            const { fieldname } = req.file

            if(!req.body[fieldname]) {
                req.body[fieldname] = req.file
            }
        }

        return next.handle()
    }
}