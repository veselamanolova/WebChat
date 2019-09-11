﻿using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using WebChatBackend.Data;
using WebChatBackend.Services;
using WebChatBackend.Services.Contracts;
using WebChatBackend.Services.UserManagement;

namespace WebChatBackend.Infrastructure
{
    public static class IServiceCollectionExtensions
    {
        public static IServiceCollection AddWebChatServices(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddDbContext<WebChatContext>(options =>
               options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));

            services.AddScoped<IUserService, UserService>();
            services.AddScoped<IGroupService, GroupService>();
            services.AddScoped<IMessageService, MessageService>();
            services.AddScoped<IJwtGenerator, JwtGenerator> (); 


            return services;

        }
    }
}
