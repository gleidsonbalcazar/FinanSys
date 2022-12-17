using System;

namespace FinansysControl.Helpers
{
    public class CustomException : Exception
{
    public int HttpStatusCode { get; private set; }

    public CustomException()
    {

    }

    public CustomException(int httpStatusCode, string message):base(message)
    {
        HttpStatusCode = httpStatusCode;
    }
}
}
