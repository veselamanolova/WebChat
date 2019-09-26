using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace Chat.Middleware
{
    public class WebSocketsAuthorizationMiddleware
    {
        private readonly RequestDelegate _next;

        public WebSocketsAuthorizationMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task Invoke(HttpContext httpContext)
        {
            var request = httpContext.Request;

            // web sockets cannot pass headers so we must take the access token from query param and
            // add it to the header before authentication middleware runs
            if (request.Path.StartsWithSegments("/chatHub", StringComparison.OrdinalIgnoreCase) &&
                request.Query.TryGetValue("access_token", out var accessToken))
            {
                request.Headers.Add("Authorization", $"Bearer {accessToken}");
            }

            await _next(httpContext);
        }
    }
}