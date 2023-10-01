import java.io
import java.lang
import java.security
import java.time
import java.util
import java.util.function
import typing


class ErrorManager(java.lang.Object):
    """
    Java class 'java.util.logging.ErrorManager'
    
        Extends:
            java.lang.Object
    
      Constructors:
        * ErrorManager()
    
      Attributes:
        GENERIC_FAILURE (int): final static field
        WRITE_FAILURE (int): final static field
        FLUSH_FAILURE (int): final static field
        CLOSE_FAILURE (int): final static field
        OPEN_FAILURE (int): final static field
        FORMAT_FAILURE (int): final static field
    
    """
    GENERIC_FAILURE: typing.ClassVar[int] = ...
    WRITE_FAILURE: typing.ClassVar[int] = ...
    FLUSH_FAILURE: typing.ClassVar[int] = ...
    CLOSE_FAILURE: typing.ClassVar[int] = ...
    OPEN_FAILURE: typing.ClassVar[int] = ...
    FORMAT_FAILURE: typing.ClassVar[int] = ...
    def __init__(self): ...
    def error(self, string: java.lang.String, exception: java.lang.Exception, int: int) -> None: ...

class Filter(java.lang.Object):
    """
    :class:`~java.lang.FunctionalInterface` public interface Filter
    
        A Filter can be used to provide fine grain control over what is logged, beyond the control provided by log levels.
    
        Each Logger and each Handler can have a filter associated with it. The Logger or Handler will call the isLoggable method
        to check if a given LogRecord should be published. If isLoggable returns false, the LogRecord will be discarded.
    
        Since:
            1.4
    
    
    """
    def isLoggable(self, logRecord: 'LogRecord') -> bool: ...

class Formatter(java.lang.Object):
    """
    Java class 'java.util.logging.Formatter'
    
        Extends:
            java.lang.Object
    
    """
    def format(self, logRecord: 'LogRecord') -> java.lang.String: ...
    def formatMessage(self, logRecord: 'LogRecord') -> java.lang.String: ...
    def getHead(self, handler: 'Handler') -> java.lang.String: ...
    def getTail(self, handler: 'Handler') -> java.lang.String: ...

class Handler(java.lang.Object):
    """
    Java class 'java.util.logging.Handler'
    
        Extends:
            java.lang.Object
    
    """
    def close(self) -> None: ...
    def flush(self) -> None: ...
    def getEncoding(self) -> java.lang.String: ...
    def getErrorManager(self) -> ErrorManager: ...
    def getFilter(self) -> Filter: ...
    def getFormatter(self) -> Formatter: ...
    def getLevel(self) -> 'Level': ...
    def isLoggable(self, logRecord: 'LogRecord') -> bool: ...
    def publish(self, logRecord: 'LogRecord') -> None: ...
    def setEncoding(self, string: java.lang.String) -> None: ...
    def setErrorManager(self, errorManager: ErrorManager) -> None: ...
    def setFilter(self, filter: Filter) -> None: ...
    def setFormatter(self, formatter: Formatter) -> None: ...
    def setLevel(self, level: 'Level') -> None: ...

class Level(java.io.Serializable):
    """
    Java class 'java.util.logging.Level'
    
        Extends:
            java.lang.Object
    
        Interfaces:
            java.io.Serializable
    
      Attributes:
        OFF (java.util.logging.Level): final static field
        SEVERE (java.util.logging.Level): final static field
        WARNING (java.util.logging.Level): final static field
        INFO (java.util.logging.Level): final static field
        CONFIG (java.util.logging.Level): final static field
        FINE (java.util.logging.Level): final static field
        FINER (java.util.logging.Level): final static field
        FINEST (java.util.logging.Level): final static field
        ALL (java.util.logging.Level): final static field
    
    """
    OFF: typing.ClassVar['Level'] = ...
    SEVERE: typing.ClassVar['Level'] = ...
    WARNING: typing.ClassVar['Level'] = ...
    INFO: typing.ClassVar['Level'] = ...
    CONFIG: typing.ClassVar['Level'] = ...
    FINE: typing.ClassVar['Level'] = ...
    FINER: typing.ClassVar['Level'] = ...
    FINEST: typing.ClassVar['Level'] = ...
    ALL: typing.ClassVar['Level'] = ...
    def equals(self, object: typing.Any) -> bool: ...
    def getLocalizedName(self) -> java.lang.String: ...
    def getName(self) -> java.lang.String: ...
    def getResourceBundleName(self) -> java.lang.String: ...
    def hashCode(self) -> int: ...
    def intValue(self) -> int: ...
    @classmethod
    def parse(cls, string: java.lang.String) -> 'Level': ...
    def toString(self) -> java.lang.String: ...

class LogManager(java.lang.Object):
    """
    Java class 'java.util.logging.LogManager'
    
        Extends:
            java.lang.Object
    
      Attributes:
        LOGGING_MXBEAN_NAME (java.lang.String): final static field
    
    """
    LOGGING_MXBEAN_NAME: typing.ClassVar[java.lang.String] = ...
    def addConfigurationListener(self, runnable: java.lang.Runnable) -> 'LogManager': ...
    def addLogger(self, logger: 'Logger') -> bool: ...
    def checkAccess(self) -> None: ...
    @classmethod
    def getLogManager(cls) -> 'LogManager': ...
    def getLogger(self, string: java.lang.String) -> 'Logger': ...
    def getLoggerNames(self) -> java.util.Enumeration[java.lang.String]: ...
    @classmethod
    def getLoggingMXBean(cls) -> 'LoggingMXBean': ...
    def getProperty(self, string: java.lang.String) -> java.lang.String: ...
    @typing.overload
    def readConfiguration(self) -> None: ...
    @typing.overload
    def readConfiguration(self, inputStream: java.io.InputStream) -> None: ...
    def removeConfigurationListener(self, runnable: java.lang.Runnable) -> None: ...
    def reset(self) -> None: ...
    @typing.overload
    def updateConfiguration(self, inputStream: java.io.InputStream, function: typing.Union[java.util.function.Function[java.lang.String, typing.Union[java.util.function.BiFunction[java.lang.String, java.lang.String, java.lang.String], typing.Callable[[java.lang.String, java.lang.String], java.lang.String]]], typing.Callable[[java.lang.String], typing.Union[java.util.function.BiFunction[java.lang.String, java.lang.String, java.lang.String], typing.Callable[[java.lang.String, java.lang.String], java.lang.String]]]]) -> None: ...
    @typing.overload
    def updateConfiguration(self, function: typing.Union[java.util.function.Function[java.lang.String, typing.Union[java.util.function.BiFunction[java.lang.String, java.lang.String, java.lang.String], typing.Callable[[java.lang.String, java.lang.String], java.lang.String]]], typing.Callable[[java.lang.String], typing.Union[java.util.function.BiFunction[java.lang.String, java.lang.String, java.lang.String], typing.Callable[[java.lang.String, java.lang.String], java.lang.String]]]]) -> None: ...

class LogRecord(java.io.Serializable):
    """
    Java class 'java.util.logging.LogRecord'
    
        Extends:
            java.lang.Object
    
        Interfaces:
            java.io.Serializable
    
      Constructors:
        * LogRecord(java.util.logging.Level, java.lang.String)
    
    """
    def __init__(self, level: Level, string: java.lang.String): ...
    def getInstant(self) -> java.time.Instant: ...
    def getLevel(self) -> Level: ...
    def getLoggerName(self) -> java.lang.String: ...
    def getMessage(self) -> java.lang.String: ...
    def getMillis(self) -> int: ...
    def getParameters(self) -> typing.List[typing.Any]: ...
    def getResourceBundle(self) -> java.util.ResourceBundle: ...
    def getResourceBundleName(self) -> java.lang.String: ...
    def getSequenceNumber(self) -> int: ...
    def getSourceClassName(self) -> java.lang.String: ...
    def getSourceMethodName(self) -> java.lang.String: ...
    def getThreadID(self) -> int: ...
    def getThrown(self) -> java.lang.Throwable: ...
    def setInstant(self, instant: java.time.Instant) -> None: ...
    def setLevel(self, level: Level) -> None: ...
    def setLoggerName(self, string: java.lang.String) -> None: ...
    def setMessage(self, string: java.lang.String) -> None: ...
    def setMillis(self, long: int) -> None: ...
    def setParameters(self, objectArray: typing.List[typing.Any]) -> None: ...
    def setResourceBundle(self, resourceBundle: java.util.ResourceBundle) -> None: ...
    def setResourceBundleName(self, string: java.lang.String) -> None: ...
    def setSequenceNumber(self, long: int) -> None: ...
    def setSourceClassName(self, string: java.lang.String) -> None: ...
    def setSourceMethodName(self, string: java.lang.String) -> None: ...
    def setThreadID(self, int: int) -> None: ...
    def setThrown(self, throwable: java.lang.Throwable) -> None: ...

class Logger(java.lang.Object):
    """
    Java class 'java.util.logging.Logger'
    
        Extends:
            java.lang.Object
    
      Attributes:
        GLOBAL_LOGGER_NAME (java.lang.String): final static field
        global (java.util.logging.Logger): final static field
    
    """
    GLOBAL_LOGGER_NAME: typing.ClassVar[java.lang.String] = ...
    global_: typing.ClassVar['Logger'] = ...
    def addHandler(self, handler: Handler) -> None: ...
    @typing.overload
    def config(self, string: java.lang.String) -> None: ...
    @typing.overload
    def config(self, supplier: typing.Union[java.util.function.Supplier[java.lang.String], typing.Callable[[], java.lang.String]]) -> None: ...
    @typing.overload
    def entering(self, string: java.lang.String, string2: java.lang.String) -> None: ...
    @typing.overload
    def entering(self, string: java.lang.String, string2: java.lang.String, object: typing.Any) -> None: ...
    @typing.overload
    def entering(self, string: java.lang.String, string2: java.lang.String, objectArray: typing.List[typing.Any]) -> None: ...
    @typing.overload
    def exiting(self, string: java.lang.String, string2: java.lang.String) -> None: ...
    @typing.overload
    def exiting(self, string: java.lang.String, string2: java.lang.String, object: typing.Any) -> None: ...
    @typing.overload
    def fine(self, string: java.lang.String) -> None: ...
    @typing.overload
    def fine(self, supplier: typing.Union[java.util.function.Supplier[java.lang.String], typing.Callable[[], java.lang.String]]) -> None: ...
    @typing.overload
    def finer(self, string: java.lang.String) -> None: ...
    @typing.overload
    def finer(self, supplier: typing.Union[java.util.function.Supplier[java.lang.String], typing.Callable[[], java.lang.String]]) -> None: ...
    @typing.overload
    def finest(self, string: java.lang.String) -> None: ...
    @typing.overload
    def finest(self, supplier: typing.Union[java.util.function.Supplier[java.lang.String], typing.Callable[[], java.lang.String]]) -> None: ...
    @classmethod
    @typing.overload
    def getAnonymousLogger(cls) -> 'Logger': ...
    @classmethod
    @typing.overload
    def getAnonymousLogger(cls, string: java.lang.String) -> 'Logger': ...
    def getFilter(self) -> Filter: ...
    @classmethod
    def getGlobal(cls) -> 'Logger': ...
    def getHandlers(self) -> typing.List[Handler]: ...
    def getLevel(self) -> Level: ...
    @classmethod
    @typing.overload
    def getLogger(cls, string: java.lang.String) -> 'Logger': ...
    @classmethod
    @typing.overload
    def getLogger(cls, string: java.lang.String, string2: java.lang.String) -> 'Logger': ...
    def getName(self) -> java.lang.String: ...
    def getParent(self) -> 'Logger': ...
    def getResourceBundle(self) -> java.util.ResourceBundle: ...
    def getResourceBundleName(self) -> java.lang.String: ...
    def getUseParentHandlers(self) -> bool: ...
    @typing.overload
    def info(self, string: java.lang.String) -> None: ...
    @typing.overload
    def info(self, supplier: typing.Union[java.util.function.Supplier[java.lang.String], typing.Callable[[], java.lang.String]]) -> None: ...
    def isLoggable(self, level: Level) -> bool: ...
    @typing.overload
    def log(self, level: Level, string: java.lang.String) -> None: ...
    @typing.overload
    def log(self, level: Level, string: java.lang.String, object: typing.Any) -> None: ...
    @typing.overload
    def log(self, level: Level, string: java.lang.String, objectArray: typing.List[typing.Any]) -> None: ...
    @typing.overload
    def log(self, level: Level, string: java.lang.String, throwable: java.lang.Throwable) -> None: ...
    @typing.overload
    def log(self, level: Level, throwable: java.lang.Throwable, supplier: typing.Union[java.util.function.Supplier[java.lang.String], typing.Callable[[], java.lang.String]]) -> None: ...
    @typing.overload
    def log(self, level: Level, supplier: typing.Union[java.util.function.Supplier[java.lang.String], typing.Callable[[], java.lang.String]]) -> None: ...
    @typing.overload
    def log(self, logRecord: LogRecord) -> None: ...
    @typing.overload
    def logp(self, level: Level, string: java.lang.String, string2: java.lang.String, string3: java.lang.String) -> None: ...
    @typing.overload
    def logp(self, level: Level, string: java.lang.String, string2: java.lang.String, string3: java.lang.String, object: typing.Any) -> None: ...
    @typing.overload
    def logp(self, level: Level, string: java.lang.String, string2: java.lang.String, string3: java.lang.String, objectArray: typing.List[typing.Any]) -> None: ...
    @typing.overload
    def logp(self, level: Level, string: java.lang.String, string2: java.lang.String, string3: java.lang.String, throwable: java.lang.Throwable) -> None: ...
    @typing.overload
    def logp(self, level: Level, string: java.lang.String, string2: java.lang.String, throwable: java.lang.Throwable, supplier: typing.Union[java.util.function.Supplier[java.lang.String], typing.Callable[[], java.lang.String]]) -> None: ...
    @typing.overload
    def logp(self, level: Level, string: java.lang.String, string2: java.lang.String, supplier: typing.Union[java.util.function.Supplier[java.lang.String], typing.Callable[[], java.lang.String]]) -> None: ...
    @typing.overload
    def logrb(self, level: Level, string: java.lang.String, string2: java.lang.String, string3: java.lang.String, string4: java.lang.String) -> None: ...
    @typing.overload
    def logrb(self, level: Level, string: java.lang.String, string2: java.lang.String, string3: java.lang.String, string4: java.lang.String, object: typing.Any) -> None: ...
    @typing.overload
    def logrb(self, level: Level, string: java.lang.String, string2: java.lang.String, string3: java.lang.String, string4: java.lang.String, objectArray: typing.List[typing.Any]) -> None: ...
    @typing.overload
    def logrb(self, level: Level, string: java.lang.String, string2: java.lang.String, string3: java.lang.String, string4: java.lang.String, throwable: java.lang.Throwable) -> None: ...
    @typing.overload
    def logrb(self, level: Level, string: java.lang.String, string2: java.lang.String, resourceBundle: java.util.ResourceBundle, string3: java.lang.String, objectArray: typing.List[typing.Any]) -> None: ...
    @typing.overload
    def logrb(self, level: Level, string: java.lang.String, string2: java.lang.String, resourceBundle: java.util.ResourceBundle, string3: java.lang.String, throwable: java.lang.Throwable) -> None: ...
    @typing.overload
    def logrb(self, level: Level, resourceBundle: java.util.ResourceBundle, string: java.lang.String, objectArray: typing.List[typing.Any]) -> None: ...
    @typing.overload
    def logrb(self, level: Level, resourceBundle: java.util.ResourceBundle, string: java.lang.String, throwable: java.lang.Throwable) -> None: ...
    def removeHandler(self, handler: Handler) -> None: ...
    def setFilter(self, filter: Filter) -> None: ...
    def setLevel(self, level: Level) -> None: ...
    def setParent(self, logger: 'Logger') -> None: ...
    def setResourceBundle(self, resourceBundle: java.util.ResourceBundle) -> None: ...
    def setUseParentHandlers(self, boolean: bool) -> None: ...
    @typing.overload
    def severe(self, string: java.lang.String) -> None: ...
    @typing.overload
    def severe(self, supplier: typing.Union[java.util.function.Supplier[java.lang.String], typing.Callable[[], java.lang.String]]) -> None: ...
    def throwing(self, string: java.lang.String, string2: java.lang.String, throwable: java.lang.Throwable) -> None: ...
    @typing.overload
    def warning(self, string: java.lang.String) -> None: ...
    @typing.overload
    def warning(self, supplier: typing.Union[java.util.function.Supplier[java.lang.String], typing.Callable[[], java.lang.String]]) -> None: ...

class LoggingMXBean(java.lang.Object):
    """
    :class:`~java.lang.Deprecated`(:meth:`~java.lang.Deprecated.since`="9") public interface LoggingMXBean
    
        Deprecated.
        :code:`LoggingMXBean` is no longer a :class:`~java.lang.management.PlatformManagedObject` and is replaced with
        :class:`~java.lang.management.PlatformLoggingMXBean`. It will not register in the platform :code:`MBeanServer`. Use
        :code:`ManagementFactory.getPlatformMXBean(PlatformLoggingMXBean.class)` instead.
        The management interface for the logging facility. :class:`~java.lang.management.PlatformLoggingMXBean` is the
        management interface for logging facility registered in the
        :meth:`~java.lang.management.ManagementFactory.getPlatformMBeanServer`. It is recommended to use the
        :code:`PlatformLoggingMXBean` obtained via the :meth:`~java.lang.management.ManagementFactory.getPlatformMXBean` method.
    
        Since:
            1.5
    
        Also see:
            :class:`~java.lang.management.PlatformLoggingMXBean`
    
    
    """
    def getLoggerLevel(self, string: java.lang.String) -> java.lang.String: ...
    def getLoggerNames(self) -> java.util.List[java.lang.String]: ...
    def getParentLoggerName(self, string: java.lang.String) -> java.lang.String: ...
    def setLoggerLevel(self, string: java.lang.String, string2: java.lang.String) -> None: ...

class LoggingPermission(java.security.BasicPermission):
    """
    Java class 'java.util.logging.LoggingPermission'
    
        Extends:
            java.security.BasicPermission
    
      Constructors:
        * LoggingPermission(java.lang.String, java.lang.String)
    
      Raises:
        java.lang.IllegalArgumentException: from java
    
    """
    def __init__(self, string: java.lang.String, string2: java.lang.String): ...

class MemoryHandler(Handler):
    """
    Java class 'java.util.logging.MemoryHandler'
    
        Extends:
            java.util.logging.Handler
    
      Constructors:
        * MemoryHandler(java.util.logging.Handler, int, java.util.logging.Level)
        * MemoryHandler()
    
    """
    @typing.overload
    def __init__(self): ...
    @typing.overload
    def __init__(self, handler: Handler, int: int, level: Level): ...
    def close(self) -> None: ...
    def flush(self) -> None: ...
    def getPushLevel(self) -> Level: ...
    def isLoggable(self, logRecord: LogRecord) -> bool: ...
    def publish(self, logRecord: LogRecord) -> None: ...
    def push(self) -> None: ...
    def setPushLevel(self, level: Level) -> None: ...

class SimpleFormatter(Formatter):
    """
    Java class 'java.util.logging.SimpleFormatter'
    
        Extends:
            java.util.logging.Formatter
    
      Constructors:
        * SimpleFormatter()
    
    """
    def __init__(self): ...
    def format(self, logRecord: LogRecord) -> java.lang.String: ...

class StreamHandler(Handler):
    """
    Java class 'java.util.logging.StreamHandler'
    
        Extends:
            java.util.logging.Handler
    
      Constructors:
        * StreamHandler(java.io.OutputStream, java.util.logging.Formatter)
        * StreamHandler()
    
    """
    @typing.overload
    def __init__(self): ...
    @typing.overload
    def __init__(self, outputStream: java.io.OutputStream, formatter: Formatter): ...
    def close(self) -> None: ...
    def flush(self) -> None: ...
    def isLoggable(self, logRecord: LogRecord) -> bool: ...
    def publish(self, logRecord: LogRecord) -> None: ...
    def setEncoding(self, string: java.lang.String) -> None: ...

class XMLFormatter(Formatter):
    """
    Java class 'java.util.logging.XMLFormatter'
    
        Extends:
            java.util.logging.Formatter
    
      Constructors:
        * XMLFormatter()
    
    """
    def __init__(self): ...
    def format(self, logRecord: LogRecord) -> java.lang.String: ...
    def getHead(self, handler: Handler) -> java.lang.String: ...
    def getTail(self, handler: Handler) -> java.lang.String: ...

class ConsoleHandler(StreamHandler):
    """
    Java class 'java.util.logging.ConsoleHandler'
    
        Extends:
            java.util.logging.StreamHandler
    
      Constructors:
        * ConsoleHandler()
    
    """
    def __init__(self): ...
    def close(self) -> None: ...
    def publish(self, logRecord: LogRecord) -> None: ...

class FileHandler(StreamHandler):
    """
    Java class 'java.util.logging.FileHandler'
    
        Extends:
            java.util.logging.StreamHandler
    
      Constructors:
        * FileHandler(java.lang.String, int, int)
        * FileHandler(java.lang.String, int, int, boolean)
        * FileHandler(java.lang.String)
        * FileHandler()
        * FileHandler(java.lang.String, long, int, boolean)
        * FileHandler(java.lang.String, boolean)
    
      Raises:
        java.io.IOException: from java
        java.lang.SecurityException: from java
    
    """
    @typing.overload
    def __init__(self): ...
    @typing.overload
    def __init__(self, string: java.lang.String): ...
    @typing.overload
    def __init__(self, string: java.lang.String, boolean: bool): ...
    @typing.overload
    def __init__(self, string: java.lang.String, int: int, int2: int): ...
    @typing.overload
    def __init__(self, string: java.lang.String, int: int, int2: int, boolean: bool): ...
    @typing.overload
    def __init__(self, string: java.lang.String, long: int, int: int, boolean: bool): ...
    def close(self) -> None: ...
    def publish(self, logRecord: LogRecord) -> None: ...

class SocketHandler(StreamHandler):
    """
    Java class 'java.util.logging.SocketHandler'
    
        Extends:
            java.util.logging.StreamHandler
    
      Constructors:
        * SocketHandler()
        * SocketHandler(java.lang.String, int)
    
      Raises:
        java.io.IOException: from java
    
    """
    @typing.overload
    def __init__(self): ...
    @typing.overload
    def __init__(self, string: java.lang.String, int: int): ...
    def close(self) -> None: ...
    def publish(self, logRecord: LogRecord) -> None: ...
