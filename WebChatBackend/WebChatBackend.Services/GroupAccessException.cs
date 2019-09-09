using System;

namespace WebChatBackend.Services
{
    [Serializable]
    public class GroupAccessException : Exception
    {
        public GroupAccessException() { }
        public GroupAccessException(string message) : base(message) { }
        public GroupAccessException(string message, Exception inner) : base(message, inner) { }
        protected GroupAccessException(
          System.Runtime.Serialization.SerializationInfo info,
          System.Runtime.Serialization.StreamingContext context) : base(info, context) { }
    }
}
