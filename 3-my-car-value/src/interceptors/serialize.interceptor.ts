import { CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common";
import { Observable, map } from "rxjs";

export class SerializeInterceptor implements NestInterceptor {

    intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
        // Run something before a request is handled by the request handler
        console.log( "I'm running before the handler" )

        return handler.handle().pipe(
            map( (data: any) => {
                // Run something before the response is sent out
                console.log( "i'm running before response is sent out" )
            })
        )
    }
}