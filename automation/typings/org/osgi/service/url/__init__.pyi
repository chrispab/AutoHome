import java.lang
import java.net
import typing


class URLConstants(java.lang.Object):
    """
    Java class 'org.osgi.service.url.URLConstants'
    
      Attributes:
        URL_HANDLER_PROTOCOL (java.lang.String): final static field
        URL_CONTENT_MIMETYPE (java.lang.String): final static field
    
    """
    URL_HANDLER_PROTOCOL: typing.ClassVar[java.lang.String] = ...
    URL_CONTENT_MIMETYPE: typing.ClassVar[java.lang.String] = ...

class URLStreamHandlerService(java.lang.Object):
    """
    Java class 'org.osgi.service.url.URLStreamHandlerService'
    
    """
    def equals(self, uRL: java.net.URL, uRL2: java.net.URL) -> bool: ...
    def getDefaultPort(self) -> int: ...
    def getHostAddress(self, uRL: java.net.URL) -> java.net.InetAddress: ...
    def hashCode(self, uRL: java.net.URL) -> int: ...
    def hostsEqual(self, uRL: java.net.URL, uRL2: java.net.URL) -> bool: ...
    def openConnection(self, uRL: java.net.URL) -> java.net.URLConnection: ...
    def parseURL(self, uRLStreamHandlerSetter: 'URLStreamHandlerSetter', uRL2: java.net.URL, string: java.lang.String, int: int, int2: int) -> None: ...
    def sameFile(self, uRL: java.net.URL, uRL2: java.net.URL) -> bool: ...
    def toExternalForm(self, uRL: java.net.URL) -> java.lang.String: ...

class URLStreamHandlerSetter(java.lang.Object):
    """
    Java class 'org.osgi.service.url.URLStreamHandlerSetter'
    
    """
    @typing.overload
    def setURL(self, uRL: java.net.URL, string: java.lang.String, string2: java.lang.String, int: int, string3: java.lang.String, string4: java.lang.String) -> None: ...
    @typing.overload
    def setURL(self, uRL: java.net.URL, string: java.lang.String, string2: java.lang.String, int: int, string3: java.lang.String, string4: java.lang.String, string5: java.lang.String, string6: java.lang.String, string7: java.lang.String) -> None: ...

class AbstractURLStreamHandlerService(java.net.URLStreamHandler, URLStreamHandlerService):
    """
    Java class 'org.osgi.service.url.AbstractURLStreamHandlerService'
    
        Extends:
            java.net.URLStreamHandler
    
        Interfaces:
            org.osgi.service.url.URLStreamHandlerService
    
      Constructors:
        * AbstractURLStreamHandlerService()
    
    """
    def __init__(self): ...
    @typing.overload
    def equals(self, object: typing.Any) -> bool: ...
    @typing.overload
    def equals(self, uRL: java.net.URL, uRL2: java.net.URL) -> bool: ...
    def getDefaultPort(self) -> int: ...
    def getHostAddress(self, uRL: java.net.URL) -> java.net.InetAddress: ...
    @typing.overload
    def hashCode(self, uRL: java.net.URL) -> int: ...
    @typing.overload
    def hashCode(self) -> int: ...
    def hostsEqual(self, uRL: java.net.URL, uRL2: java.net.URL) -> bool: ...
    def openConnection(self, uRL: java.net.URL) -> java.net.URLConnection: ...
    def parseURL(self, uRLStreamHandlerSetter: URLStreamHandlerSetter, uRL2: java.net.URL, string: java.lang.String, int: int, int2: int) -> None: ...
    def sameFile(self, uRL: java.net.URL, uRL2: java.net.URL) -> bool: ...
    def toExternalForm(self, uRL: java.net.URL) -> java.lang.String: ...
