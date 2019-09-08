using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebChatBackend.Data;
using WebChatBackend.Data.Models;
using WebChatBackend.Services.Contracts;


namespace WebChatBackend.Services
{
    public class GroupService: IGroupService
    {
        private readonly WebChatContext _context;

        public GroupService(WebChatContext context)
        {
            _context = context;
        }             
    }
}
