using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using WebChatBackend.Data.Models;
using WebChatBackend.Services;
using WebChatBackend.Services.Contracts;

namespace WebChatBackend.WebAPI.Controllers
{
    
    [Route("api/[controller]")]
    [ApiController]
    public class PublicChatController : ControllerBase
    {
        private readonly IGroupService _groupService;

        public PublicChatController(IGroupService groupService)
        {
            _groupService = groupService;
        }

        // GET api/publicchat
        [HttpGet]
        public async Task<ActionResult<List<Message>>> Get()
        {
            List<Message> publicMessages = await _groupService.GetAllGlobalGroupMessagesAsync();
            return publicMessages;
        }

        // GET api/chat/5
        [HttpGet("{id}")]
        public ActionResult<string> Get(int id)
        {
            return "value";
        }

        // POST api/chat
        [HttpPost]
        public void Post([FromBody] string value)
        {
        }

        // PUT api/chat/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/chat/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
