using System.Net;
using System.Text.Json;

namespace StudentManagement.Middleware
{
    // This middleware catches any unhandled exceptions in the app
    // and returns a clean JSON error response instead of crashing
    public class ExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionMiddleware> _logger;

        public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger)
        {
            _next   = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                // Try to process the request normally
                await _next(context);
            }
            catch (Exception ex)
            {
                // Log the error details for debugging
                _logger.LogError(ex, "An unhandled exception occurred: {Message}", ex.Message);

                // Return a 500 response with a JSON error message
                context.Response.StatusCode  = (int)HttpStatusCode.InternalServerError;
                context.Response.ContentType = "application/json";

                var errorResponse = new
                {
                    error  = "An unexpected error occurred. Please try again later.",
                    detail = ex.Message
                };

                await context.Response.WriteAsync(JsonSerializer.Serialize(errorResponse));
            }
        }
    }
}
