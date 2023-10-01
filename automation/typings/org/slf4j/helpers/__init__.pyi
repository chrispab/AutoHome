import java.lang
import java.util
import java.util.concurrent
import org
import org.slf4j
import org.slf4j.event
import org.slf4j.spi
import typing


class BasicMDCAdapter(org.slf4j.spi.MDCAdapter):
    """
    Java class 'org.slf4j.helpers.BasicMDCAdapter'
    
        Extends:
            java.lang.Object
    
        Interfaces:
            org.slf4j.spi.MDCAdapter
    
      Constructors:
        * BasicMDCAdapter()
    
    """
    def __init__(self): ...
    def clear(self) -> None: ...
    def get(self, string: java.lang.String) -> java.lang.String: ...
    def getCopyOfContextMap(self) -> java.util.Map[java.lang.String, java.lang.String]: ...
    def getKeys(self) -> java.util.Set[java.lang.String]: ...
    def put(self, string: java.lang.String, string2: java.lang.String) -> None: ...
    def remove(self, string: java.lang.String) -> None: ...
    def setContextMap(self, map: typing.Union[java.util.Map[java.lang.String, java.lang.String], typing.Mapping[java.lang.String, java.lang.String]]) -> None: ...

class BasicMarker(org.slf4j.Marker):
    """
    Java class 'org.slf4j.helpers.BasicMarker'
    
        Extends:
            java.lang.Object
    
        Interfaces:
            org.slf4j.Marker
    
    """
    def add(self, marker: org.slf4j.Marker) -> None: ...
    @typing.overload
    def contains(self, string: java.lang.String) -> bool: ...
    @typing.overload
    def contains(self, marker: org.slf4j.Marker) -> bool: ...
    def equals(self, object: typing.Any) -> bool: ...
    def getName(self) -> java.lang.String: ...
    def hasChildren(self) -> bool: ...
    def hasReferences(self) -> bool: ...
    def hashCode(self) -> int: ...
    def iterator(self) -> java.util.Iterator[org.slf4j.Marker]: ...
    def remove(self, marker: org.slf4j.Marker) -> bool: ...
    def toString(self) -> java.lang.String: ...

class BasicMarkerFactory(org.slf4j.IMarkerFactory):
    """
    Java class 'org.slf4j.helpers.BasicMarkerFactory'
    
        Extends:
            java.lang.Object
    
        Interfaces:
            org.slf4j.IMarkerFactory
    
      Constructors:
        * BasicMarkerFactory()
    
    """
    def __init__(self): ...
    def detachMarker(self, string: java.lang.String) -> bool: ...
    def exists(self, string: java.lang.String) -> bool: ...
    def getDetachedMarker(self, string: java.lang.String) -> org.slf4j.Marker: ...
    def getMarker(self, string: java.lang.String) -> org.slf4j.Marker: ...

class FormattingTuple(java.lang.Object):
    """
    Java class 'org.slf4j.helpers.FormattingTuple'
    
        Extends:
            java.lang.Object
    
      Constructors:
        * FormattingTuple(java.lang.String)
        * FormattingTuple(java.lang.String, java.lang.Object[], java.lang.Throwable)
    
      Attributes:
        NULL (org.slf4j.helpers.FormattingTuple): static field
    
    """
    NULL: typing.ClassVar['FormattingTuple'] = ...
    @typing.overload
    def __init__(self, string: java.lang.String): ...
    @typing.overload
    def __init__(self, string: java.lang.String, objectArray: typing.List[typing.Any], throwable: java.lang.Throwable): ...
    def getArgArray(self) -> typing.List[typing.Any]: ...
    def getMessage(self) -> java.lang.String: ...
    def getThrowable(self) -> java.lang.Throwable: ...

class MessageFormatter(java.lang.Object):
    """
    Java class 'org.slf4j.helpers.MessageFormatter'
    
        Extends:
            java.lang.Object
    
      Constructors:
        * MessageFormatter()
    
    """
    def __init__(self): ...
    @classmethod
    @typing.overload
    def arrayFormat(cls, string: java.lang.String, objectArray: typing.List[typing.Any]) -> FormattingTuple: ...
    @classmethod
    @typing.overload
    def arrayFormat(cls, string: java.lang.String, objectArray: typing.List[typing.Any], throwable: java.lang.Throwable) -> FormattingTuple: ...
    @classmethod
    @typing.overload
    def format(cls, string: java.lang.String, object: typing.Any) -> FormattingTuple: ...
    @classmethod
    @typing.overload
    def format(cls, string: java.lang.String, object: typing.Any, object2: typing.Any) -> FormattingTuple: ...

class NOPLoggerFactory(org.slf4j.ILoggerFactory):
    """
    Java class 'org.slf4j.helpers.NOPLoggerFactory'
    
        Extends:
            java.lang.Object
    
        Interfaces:
            org.slf4j.ILoggerFactory
    
      Constructors:
        * NOPLoggerFactory()
    
    """
    def __init__(self): ...
    def getLogger(self, string: java.lang.String) -> org.slf4j.Logger: ...

class NOPMDCAdapter(org.slf4j.spi.MDCAdapter):
    """
    Java class 'org.slf4j.helpers.NOPMDCAdapter'
    
        Extends:
            java.lang.Object
    
        Interfaces:
            org.slf4j.spi.MDCAdapter
    
      Constructors:
        * NOPMDCAdapter()
    
    """
    def __init__(self): ...
    def clear(self) -> None: ...
    def get(self, string: java.lang.String) -> java.lang.String: ...
    def getCopyOfContextMap(self) -> java.util.Map[java.lang.String, java.lang.String]: ...
    def put(self, string: java.lang.String, string2: java.lang.String) -> None: ...
    def remove(self, string: java.lang.String) -> None: ...
    def setContextMap(self, map: typing.Union[java.util.Map[java.lang.String, java.lang.String], typing.Mapping[java.lang.String, java.lang.String]]) -> None: ...

class SubstituteLogger(org.slf4j.Logger):
    """
    Java class 'org.slf4j.helpers.SubstituteLogger'
    
        Extends:
            java.lang.Object
    
        Interfaces:
            org.slf4j.Logger
    
      Constructors:
        * SubstituteLogger(java.lang.String, java.util.Queue, boolean)
    
    """
    def __init__(self, string: java.lang.String, queue: java.util.Queue[org.slf4j.event.SubstituteLoggingEvent], boolean: bool): ...
    @typing.overload
    def debug(self, string: java.lang.String) -> None: ...
    @typing.overload
    def debug(self, string: java.lang.String, object: typing.Any) -> None: ...
    @typing.overload
    def debug(self, string: java.lang.String, object: typing.Any, object2: typing.Any) -> None: ...
    @typing.overload
    def debug(self, string: java.lang.String, objectArray: typing.List[typing.Any]) -> None: ...
    @typing.overload
    def debug(self, string: java.lang.String, throwable: java.lang.Throwable) -> None: ...
    @typing.overload
    def debug(self, marker: org.slf4j.Marker, string: java.lang.String) -> None: ...
    @typing.overload
    def debug(self, marker: org.slf4j.Marker, string: java.lang.String, object: typing.Any) -> None: ...
    @typing.overload
    def debug(self, marker: org.slf4j.Marker, string: java.lang.String, object: typing.Any, object2: typing.Any) -> None: ...
    @typing.overload
    def debug(self, marker: org.slf4j.Marker, string: java.lang.String, objectArray: typing.List[typing.Any]) -> None: ...
    @typing.overload
    def debug(self, marker: org.slf4j.Marker, string: java.lang.String, throwable: java.lang.Throwable) -> None: ...
    def equals(self, object: typing.Any) -> bool: ...
    @typing.overload
    def error(self, string: java.lang.String) -> None: ...
    @typing.overload
    def error(self, string: java.lang.String, object: typing.Any) -> None: ...
    @typing.overload
    def error(self, string: java.lang.String, object: typing.Any, object2: typing.Any) -> None: ...
    @typing.overload
    def error(self, string: java.lang.String, objectArray: typing.List[typing.Any]) -> None: ...
    @typing.overload
    def error(self, string: java.lang.String, throwable: java.lang.Throwable) -> None: ...
    @typing.overload
    def error(self, marker: org.slf4j.Marker, string: java.lang.String) -> None: ...
    @typing.overload
    def error(self, marker: org.slf4j.Marker, string: java.lang.String, object: typing.Any) -> None: ...
    @typing.overload
    def error(self, marker: org.slf4j.Marker, string: java.lang.String, object: typing.Any, object2: typing.Any) -> None: ...
    @typing.overload
    def error(self, marker: org.slf4j.Marker, string: java.lang.String, objectArray: typing.List[typing.Any]) -> None: ...
    @typing.overload
    def error(self, marker: org.slf4j.Marker, string: java.lang.String, throwable: java.lang.Throwable) -> None: ...
    def getName(self) -> java.lang.String: ...
    def hashCode(self) -> int: ...
    @typing.overload
    def info(self, string: java.lang.String) -> None: ...
    @typing.overload
    def info(self, string: java.lang.String, object: typing.Any) -> None: ...
    @typing.overload
    def info(self, string: java.lang.String, object: typing.Any, object2: typing.Any) -> None: ...
    @typing.overload
    def info(self, string: java.lang.String, objectArray: typing.List[typing.Any]) -> None: ...
    @typing.overload
    def info(self, string: java.lang.String, throwable: java.lang.Throwable) -> None: ...
    @typing.overload
    def info(self, marker: org.slf4j.Marker, string: java.lang.String) -> None: ...
    @typing.overload
    def info(self, marker: org.slf4j.Marker, string: java.lang.String, object: typing.Any) -> None: ...
    @typing.overload
    def info(self, marker: org.slf4j.Marker, string: java.lang.String, object: typing.Any, object2: typing.Any) -> None: ...
    @typing.overload
    def info(self, marker: org.slf4j.Marker, string: java.lang.String, objectArray: typing.List[typing.Any]) -> None: ...
    @typing.overload
    def info(self, marker: org.slf4j.Marker, string: java.lang.String, throwable: java.lang.Throwable) -> None: ...
    @typing.overload
    def isDebugEnabled(self) -> bool: ...
    @typing.overload
    def isDebugEnabled(self, marker: org.slf4j.Marker) -> bool: ...
    def isDelegateEventAware(self) -> bool: ...
    def isDelegateNOP(self) -> bool: ...
    def isDelegateNull(self) -> bool: ...
    @typing.overload
    def isErrorEnabled(self) -> bool: ...
    @typing.overload
    def isErrorEnabled(self, marker: org.slf4j.Marker) -> bool: ...
    @typing.overload
    def isInfoEnabled(self) -> bool: ...
    @typing.overload
    def isInfoEnabled(self, marker: org.slf4j.Marker) -> bool: ...
    @typing.overload
    def isTraceEnabled(self) -> bool: ...
    @typing.overload
    def isTraceEnabled(self, marker: org.slf4j.Marker) -> bool: ...
    @typing.overload
    def isWarnEnabled(self) -> bool: ...
    @typing.overload
    def isWarnEnabled(self, marker: org.slf4j.Marker) -> bool: ...
    def log(self, loggingEvent: org.slf4j.event.LoggingEvent) -> None: ...
    def setDelegate(self, logger: org.slf4j.Logger) -> None: ...
    @typing.overload
    def trace(self, string: java.lang.String) -> None: ...
    @typing.overload
    def trace(self, string: java.lang.String, object: typing.Any) -> None: ...
    @typing.overload
    def trace(self, string: java.lang.String, object: typing.Any, object2: typing.Any) -> None: ...
    @typing.overload
    def trace(self, string: java.lang.String, objectArray: typing.List[typing.Any]) -> None: ...
    @typing.overload
    def trace(self, string: java.lang.String, throwable: java.lang.Throwable) -> None: ...
    @typing.overload
    def trace(self, marker: org.slf4j.Marker, string: java.lang.String) -> None: ...
    @typing.overload
    def trace(self, marker: org.slf4j.Marker, string: java.lang.String, object: typing.Any) -> None: ...
    @typing.overload
    def trace(self, marker: org.slf4j.Marker, string: java.lang.String, object: typing.Any, object2: typing.Any) -> None: ...
    @typing.overload
    def trace(self, marker: org.slf4j.Marker, string: java.lang.String, objectArray: typing.List[typing.Any]) -> None: ...
    @typing.overload
    def trace(self, marker: org.slf4j.Marker, string: java.lang.String, throwable: java.lang.Throwable) -> None: ...
    @typing.overload
    def warn(self, string: java.lang.String) -> None: ...
    @typing.overload
    def warn(self, string: java.lang.String, object: typing.Any) -> None: ...
    @typing.overload
    def warn(self, string: java.lang.String, object: typing.Any, object2: typing.Any) -> None: ...
    @typing.overload
    def warn(self, string: java.lang.String, objectArray: typing.List[typing.Any]) -> None: ...
    @typing.overload
    def warn(self, string: java.lang.String, throwable: java.lang.Throwable) -> None: ...
    @typing.overload
    def warn(self, marker: org.slf4j.Marker, string: java.lang.String) -> None: ...
    @typing.overload
    def warn(self, marker: org.slf4j.Marker, string: java.lang.String, object: typing.Any) -> None: ...
    @typing.overload
    def warn(self, marker: org.slf4j.Marker, string: java.lang.String, object: typing.Any, object2: typing.Any) -> None: ...
    @typing.overload
    def warn(self, marker: org.slf4j.Marker, string: java.lang.String, objectArray: typing.List[typing.Any]) -> None: ...
    @typing.overload
    def warn(self, marker: org.slf4j.Marker, string: java.lang.String, throwable: java.lang.Throwable) -> None: ...

class SubstituteLoggerFactory(org.slf4j.ILoggerFactory):
    """
    Java class 'org.slf4j.helpers.SubstituteLoggerFactory'
    
        Extends:
            java.lang.Object
    
        Interfaces:
            org.slf4j.ILoggerFactory
    
      Constructors:
        * SubstituteLoggerFactory()
    
    """
    def __init__(self): ...
    def clear(self) -> None: ...
    def getEventQueue(self) -> java.util.concurrent.LinkedBlockingQueue[org.slf4j.event.SubstituteLoggingEvent]: ...
    def getLogger(self, string: java.lang.String) -> org.slf4j.Logger: ...
    def getLoggerNames(self) -> java.util.List[java.lang.String]: ...
    def getLoggers(self) -> java.util.List[SubstituteLogger]: ...
    def postInitialization(self) -> None: ...

class Util(java.lang.Object):
    """
    Java class 'org.slf4j.helpers.Util'
    
        Extends:
            java.lang.Object
    
    """
    @classmethod
    def getCallingClass(cls) -> typing.Type[typing.Any]: ...
    @classmethod
    @typing.overload
    def report(cls, string: java.lang.String) -> None: ...
    @classmethod
    @typing.overload
    def report(cls, string: java.lang.String, throwable: java.lang.Throwable) -> None: ...
    @classmethod
    def safeGetBooleanSystemProperty(cls, string: java.lang.String) -> bool: ...
    @classmethod
    def safeGetSystemProperty(cls, string: java.lang.String) -> java.lang.String: ...

class MarkerIgnoringBase(org.slf4j.helpers.NamedLoggerBase):
    """
    Java class 'org.slf4j.helpers.MarkerIgnoringBase'
    
        Extends:
            org.slf4j.helpers.NamedLoggerBase
    
        Interfaces:
            org.slf4j.Logger
    
      Constructors:
        * MarkerIgnoringBase()
    
    """
    def __init__(self): ...
    @typing.overload
    def debug(self, string: java.lang.String) -> None: ...
    @typing.overload
    def debug(self, string: java.lang.String, object: typing.Any) -> None: ...
    @typing.overload
    def debug(self, string: java.lang.String, object: typing.Any, object2: typing.Any) -> None: ...
    @typing.overload
    def debug(self, string: java.lang.String, objectArray: typing.List[typing.Any]) -> None: ...
    @typing.overload
    def debug(self, string: java.lang.String, throwable: java.lang.Throwable) -> None: ...
    @typing.overload
    def debug(self, marker: org.slf4j.Marker, string: java.lang.String) -> None: ...
    @typing.overload
    def debug(self, marker: org.slf4j.Marker, string: java.lang.String, object: typing.Any) -> None: ...
    @typing.overload
    def debug(self, marker: org.slf4j.Marker, string: java.lang.String, object: typing.Any, object2: typing.Any) -> None: ...
    @typing.overload
    def debug(self, marker: org.slf4j.Marker, string: java.lang.String, objectArray: typing.List[typing.Any]) -> None: ...
    @typing.overload
    def debug(self, marker: org.slf4j.Marker, string: java.lang.String, throwable: java.lang.Throwable) -> None: ...
    @typing.overload
    def error(self, string: java.lang.String) -> None: ...
    @typing.overload
    def error(self, string: java.lang.String, object: typing.Any) -> None: ...
    @typing.overload
    def error(self, string: java.lang.String, object: typing.Any, object2: typing.Any) -> None: ...
    @typing.overload
    def error(self, string: java.lang.String, objectArray: typing.List[typing.Any]) -> None: ...
    @typing.overload
    def error(self, string: java.lang.String, throwable: java.lang.Throwable) -> None: ...
    @typing.overload
    def error(self, marker: org.slf4j.Marker, string: java.lang.String) -> None: ...
    @typing.overload
    def error(self, marker: org.slf4j.Marker, string: java.lang.String, object: typing.Any) -> None: ...
    @typing.overload
    def error(self, marker: org.slf4j.Marker, string: java.lang.String, object: typing.Any, object2: typing.Any) -> None: ...
    @typing.overload
    def error(self, marker: org.slf4j.Marker, string: java.lang.String, objectArray: typing.List[typing.Any]) -> None: ...
    @typing.overload
    def error(self, marker: org.slf4j.Marker, string: java.lang.String, throwable: java.lang.Throwable) -> None: ...
    def getName(self) -> java.lang.String: ...
    @typing.overload
    def info(self, string: java.lang.String) -> None: ...
    @typing.overload
    def info(self, string: java.lang.String, object: typing.Any) -> None: ...
    @typing.overload
    def info(self, string: java.lang.String, object: typing.Any, object2: typing.Any) -> None: ...
    @typing.overload
    def info(self, string: java.lang.String, objectArray: typing.List[typing.Any]) -> None: ...
    @typing.overload
    def info(self, string: java.lang.String, throwable: java.lang.Throwable) -> None: ...
    @typing.overload
    def info(self, marker: org.slf4j.Marker, string: java.lang.String) -> None: ...
    @typing.overload
    def info(self, marker: org.slf4j.Marker, string: java.lang.String, object: typing.Any) -> None: ...
    @typing.overload
    def info(self, marker: org.slf4j.Marker, string: java.lang.String, object: typing.Any, object2: typing.Any) -> None: ...
    @typing.overload
    def info(self, marker: org.slf4j.Marker, string: java.lang.String, objectArray: typing.List[typing.Any]) -> None: ...
    @typing.overload
    def info(self, marker: org.slf4j.Marker, string: java.lang.String, throwable: java.lang.Throwable) -> None: ...
    @typing.overload
    def isDebugEnabled(self) -> bool: ...
    @typing.overload
    def isDebugEnabled(self, marker: org.slf4j.Marker) -> bool: ...
    @typing.overload
    def isErrorEnabled(self) -> bool: ...
    @typing.overload
    def isErrorEnabled(self, marker: org.slf4j.Marker) -> bool: ...
    @typing.overload
    def isInfoEnabled(self) -> bool: ...
    @typing.overload
    def isInfoEnabled(self, marker: org.slf4j.Marker) -> bool: ...
    @typing.overload
    def isTraceEnabled(self) -> bool: ...
    @typing.overload
    def isTraceEnabled(self, marker: org.slf4j.Marker) -> bool: ...
    @typing.overload
    def isWarnEnabled(self) -> bool: ...
    @typing.overload
    def isWarnEnabled(self, marker: org.slf4j.Marker) -> bool: ...
    def toString(self) -> java.lang.String: ...
    @typing.overload
    def trace(self, string: java.lang.String) -> None: ...
    @typing.overload
    def trace(self, string: java.lang.String, object: typing.Any) -> None: ...
    @typing.overload
    def trace(self, string: java.lang.String, object: typing.Any, object2: typing.Any) -> None: ...
    @typing.overload
    def trace(self, string: java.lang.String, objectArray: typing.List[typing.Any]) -> None: ...
    @typing.overload
    def trace(self, string: java.lang.String, throwable: java.lang.Throwable) -> None: ...
    @typing.overload
    def trace(self, marker: org.slf4j.Marker, string: java.lang.String) -> None: ...
    @typing.overload
    def trace(self, marker: org.slf4j.Marker, string: java.lang.String, object: typing.Any) -> None: ...
    @typing.overload
    def trace(self, marker: org.slf4j.Marker, string: java.lang.String, object: typing.Any, object2: typing.Any) -> None: ...
    @typing.overload
    def trace(self, marker: org.slf4j.Marker, string: java.lang.String, objectArray: typing.List[typing.Any]) -> None: ...
    @typing.overload
    def trace(self, marker: org.slf4j.Marker, string: java.lang.String, throwable: java.lang.Throwable) -> None: ...
    @typing.overload
    def warn(self, string: java.lang.String) -> None: ...
    @typing.overload
    def warn(self, string: java.lang.String, object: typing.Any) -> None: ...
    @typing.overload
    def warn(self, string: java.lang.String, object: typing.Any, object2: typing.Any) -> None: ...
    @typing.overload
    def warn(self, string: java.lang.String, objectArray: typing.List[typing.Any]) -> None: ...
    @typing.overload
    def warn(self, string: java.lang.String, throwable: java.lang.Throwable) -> None: ...
    @typing.overload
    def warn(self, marker: org.slf4j.Marker, string: java.lang.String) -> None: ...
    @typing.overload
    def warn(self, marker: org.slf4j.Marker, string: java.lang.String, object: typing.Any) -> None: ...
    @typing.overload
    def warn(self, marker: org.slf4j.Marker, string: java.lang.String, object: typing.Any, object2: typing.Any) -> None: ...
    @typing.overload
    def warn(self, marker: org.slf4j.Marker, string: java.lang.String, objectArray: typing.List[typing.Any]) -> None: ...
    @typing.overload
    def warn(self, marker: org.slf4j.Marker, string: java.lang.String, throwable: java.lang.Throwable) -> None: ...

class NOPLogger(MarkerIgnoringBase):
    """
    Java class 'org.slf4j.helpers.NOPLogger'
    
        Extends:
            org.slf4j.helpers.MarkerIgnoringBase
    
      Attributes:
        NOP_LOGGER (org.slf4j.helpers.NOPLogger): final static field
    
    """
    NOP_LOGGER: typing.ClassVar['NOPLogger'] = ...
    @typing.overload
    def debug(self, string: java.lang.String) -> None: ...
    @typing.overload
    def debug(self, string: java.lang.String, object: typing.Any) -> None: ...
    @typing.overload
    def debug(self, string: java.lang.String, object: typing.Any, object2: typing.Any) -> None: ...
    @typing.overload
    def debug(self, string: java.lang.String, objectArray: typing.List[typing.Any]) -> None: ...
    @typing.overload
    def debug(self, string: java.lang.String, throwable: java.lang.Throwable) -> None: ...
    @typing.overload
    def debug(self, marker: org.slf4j.Marker, string: java.lang.String) -> None: ...
    @typing.overload
    def debug(self, marker: org.slf4j.Marker, string: java.lang.String, object: typing.Any) -> None: ...
    @typing.overload
    def debug(self, marker: org.slf4j.Marker, string: java.lang.String, object: typing.Any, object2: typing.Any) -> None: ...
    @typing.overload
    def debug(self, marker: org.slf4j.Marker, string: java.lang.String, objectArray: typing.List[typing.Any]) -> None: ...
    @typing.overload
    def debug(self, marker: org.slf4j.Marker, string: java.lang.String, throwable: java.lang.Throwable) -> None: ...
    @typing.overload
    def error(self, string: java.lang.String) -> None: ...
    @typing.overload
    def error(self, string: java.lang.String, object: typing.Any) -> None: ...
    @typing.overload
    def error(self, string: java.lang.String, object: typing.Any, object2: typing.Any) -> None: ...
    @typing.overload
    def error(self, string: java.lang.String, objectArray: typing.List[typing.Any]) -> None: ...
    @typing.overload
    def error(self, string: java.lang.String, throwable: java.lang.Throwable) -> None: ...
    @typing.overload
    def error(self, marker: org.slf4j.Marker, string: java.lang.String) -> None: ...
    @typing.overload
    def error(self, marker: org.slf4j.Marker, string: java.lang.String, object: typing.Any) -> None: ...
    @typing.overload
    def error(self, marker: org.slf4j.Marker, string: java.lang.String, object: typing.Any, object2: typing.Any) -> None: ...
    @typing.overload
    def error(self, marker: org.slf4j.Marker, string: java.lang.String, objectArray: typing.List[typing.Any]) -> None: ...
    @typing.overload
    def error(self, marker: org.slf4j.Marker, string: java.lang.String, throwable: java.lang.Throwable) -> None: ...
    def getName(self) -> java.lang.String: ...
    @typing.overload
    def info(self, string: java.lang.String) -> None: ...
    @typing.overload
    def info(self, string: java.lang.String, object: typing.Any) -> None: ...
    @typing.overload
    def info(self, string: java.lang.String, object: typing.Any, object2: typing.Any) -> None: ...
    @typing.overload
    def info(self, string: java.lang.String, objectArray: typing.List[typing.Any]) -> None: ...
    @typing.overload
    def info(self, string: java.lang.String, throwable: java.lang.Throwable) -> None: ...
    @typing.overload
    def info(self, marker: org.slf4j.Marker, string: java.lang.String) -> None: ...
    @typing.overload
    def info(self, marker: org.slf4j.Marker, string: java.lang.String, object: typing.Any) -> None: ...
    @typing.overload
    def info(self, marker: org.slf4j.Marker, string: java.lang.String, object: typing.Any, object2: typing.Any) -> None: ...
    @typing.overload
    def info(self, marker: org.slf4j.Marker, string: java.lang.String, objectArray: typing.List[typing.Any]) -> None: ...
    @typing.overload
    def info(self, marker: org.slf4j.Marker, string: java.lang.String, throwable: java.lang.Throwable) -> None: ...
    @typing.overload
    def isDebugEnabled(self, marker: org.slf4j.Marker) -> bool: ...
    @typing.overload
    def isDebugEnabled(self) -> bool: ...
    @typing.overload
    def isErrorEnabled(self, marker: org.slf4j.Marker) -> bool: ...
    @typing.overload
    def isErrorEnabled(self) -> bool: ...
    @typing.overload
    def isInfoEnabled(self, marker: org.slf4j.Marker) -> bool: ...
    @typing.overload
    def isInfoEnabled(self) -> bool: ...
    @typing.overload
    def isTraceEnabled(self, marker: org.slf4j.Marker) -> bool: ...
    @typing.overload
    def isTraceEnabled(self) -> bool: ...
    @typing.overload
    def isWarnEnabled(self, marker: org.slf4j.Marker) -> bool: ...
    @typing.overload
    def isWarnEnabled(self) -> bool: ...
    @typing.overload
    def trace(self, string: java.lang.String) -> None: ...
    @typing.overload
    def trace(self, string: java.lang.String, object: typing.Any) -> None: ...
    @typing.overload
    def trace(self, string: java.lang.String, object: typing.Any, object2: typing.Any) -> None: ...
    @typing.overload
    def trace(self, string: java.lang.String, objectArray: typing.List[typing.Any]) -> None: ...
    @typing.overload
    def trace(self, string: java.lang.String, throwable: java.lang.Throwable) -> None: ...
    @typing.overload
    def trace(self, marker: org.slf4j.Marker, string: java.lang.String) -> None: ...
    @typing.overload
    def trace(self, marker: org.slf4j.Marker, string: java.lang.String, object: typing.Any) -> None: ...
    @typing.overload
    def trace(self, marker: org.slf4j.Marker, string: java.lang.String, object: typing.Any, object2: typing.Any) -> None: ...
    @typing.overload
    def trace(self, marker: org.slf4j.Marker, string: java.lang.String, objectArray: typing.List[typing.Any]) -> None: ...
    @typing.overload
    def trace(self, marker: org.slf4j.Marker, string: java.lang.String, throwable: java.lang.Throwable) -> None: ...
    @typing.overload
    def warn(self, string: java.lang.String) -> None: ...
    @typing.overload
    def warn(self, string: java.lang.String, object: typing.Any) -> None: ...
    @typing.overload
    def warn(self, string: java.lang.String, object: typing.Any, object2: typing.Any) -> None: ...
    @typing.overload
    def warn(self, string: java.lang.String, objectArray: typing.List[typing.Any]) -> None: ...
    @typing.overload
    def warn(self, string: java.lang.String, throwable: java.lang.Throwable) -> None: ...
    @typing.overload
    def warn(self, marker: org.slf4j.Marker, string: java.lang.String) -> None: ...
    @typing.overload
    def warn(self, marker: org.slf4j.Marker, string: java.lang.String, object: typing.Any) -> None: ...
    @typing.overload
    def warn(self, marker: org.slf4j.Marker, string: java.lang.String, object: typing.Any, object2: typing.Any) -> None: ...
    @typing.overload
    def warn(self, marker: org.slf4j.Marker, string: java.lang.String, objectArray: typing.List[typing.Any]) -> None: ...
    @typing.overload
    def warn(self, marker: org.slf4j.Marker, string: java.lang.String, throwable: java.lang.Throwable) -> None: ...

class NamedLoggerBase: ...
