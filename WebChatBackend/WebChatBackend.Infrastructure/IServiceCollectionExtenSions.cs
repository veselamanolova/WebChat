using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System;
using WebChatBackend.Data;
using WebChatBackend.Services;
using WebChatBackend.Services.Contracts;

namespace WebChatBackend.Infrastructure
{
    public static class IServiceCollectionExtensions
    {
        public static IServiceCollection AddWebChatServices(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddDbContext<WebChatContext>(options =>
               options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));

            services.AddScoped<IMessageService, MessageService>();
            services.AddScoped<IGroupService, GroupService>();

            return services;

        }
    }
}
