import { ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
 
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt'){
    canActivate(context: ExecutionContext) {
      const request = context.switchToHttp().getRequest();
      console.log('Request headers:', request.headers);
        console.log('JwtAuthGuard: Checking authentication');
        return super.canActivate(context);
      }
    
      handleRequest(err, user, info,context:ExecutionContext) {
        console.log('JwtAuthGuard: Handling request', { err, user, info,context });
        return super.handleRequest(err, user, info,context);
      }
}