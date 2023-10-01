import java.lang
import java.math
import java.nio.charset
import java.util
import java.util.concurrent
import org
import org.openhab.core.io.transport.modbus.endpoint
import org.openhab.core.library.types
import org.openhab.core.types
import typing


_AsyncModbusFailure__R = typing.TypeVar('_AsyncModbusFailure__R')  # <R>
class AsyncModbusFailure(java.lang.Object, typing.Generic[_AsyncModbusFailure__R]):
    """
    Java class 'org.openhab.core.io.transport.modbus.AsyncModbusFailure'
    
        Extends:
            java.lang.Object
    
      Constructors:
        * AsyncModbusFailure(java.lang.Object, java.lang.Exception)
    
    """
    def __init__(self, request: _AsyncModbusFailure__R, cause: java.lang.Exception): ...
    def getCause(self) -> java.lang.Exception: ...
    def getRequest(self) -> _AsyncModbusFailure__R: ...
    def toString(self) -> java.lang.String: ...

class AsyncModbusReadResult(java.lang.Object):
    """
    Java class 'org.openhab.core.io.transport.modbus.AsyncModbusReadResult'
    
        Extends:
            java.lang.Object
    
      Constructors:
        * AsyncModbusReadResult(org.openhab.core.io.transport.modbus.ModbusReadRequestBlueprint, org.openhab.core.io.transport.modbus.ModbusRegisterArray)
        * AsyncModbusReadResult(org.openhab.core.io.transport.modbus.ModbusReadRequestBlueprint, org.openhab.core.io.transport.modbus.BitArray)
    
    """
    @typing.overload
    def __init__(self, request: 'ModbusReadRequestBlueprint', bits: 'BitArray'): ...
    @typing.overload
    def __init__(self, request: 'ModbusReadRequestBlueprint', registers: 'ModbusRegisterArray'): ...
    def getBits(self) -> java.util.Optional['BitArray']: ...
    def getRegisters(self) -> java.util.Optional['ModbusRegisterArray']: ...
    def getRequest(self) -> 'ModbusReadRequestBlueprint': ...
    def toString(self) -> java.lang.String: ...

class AsyncModbusWriteResult(java.lang.Object):
    """
    Java class 'org.openhab.core.io.transport.modbus.AsyncModbusWriteResult'
    
        Extends:
            java.lang.Object
    
      Constructors:
        * AsyncModbusWriteResult(org.openhab.core.io.transport.modbus.ModbusWriteRequestBlueprint, org.openhab.core.io.transport.modbus.ModbusResponse)
    
    """
    def __init__(self, request: 'ModbusWriteRequestBlueprint', response: 'ModbusResponse'): ...
    def getRequest(self) -> 'ModbusWriteRequestBlueprint': ...
    def getResponse(self) -> 'ModbusResponse': ...
    def toString(self) -> java.lang.String: ...

class BitArray(java.lang.Iterable[bool]):
    """
    Java class 'org.openhab.core.io.transport.modbus.BitArray'
    
        Extends:
            java.lang.Object
    
        Interfaces:
            java.lang.Iterable
    
      Constructors:
        * BitArray(java.util.BitSet, int)
        * BitArray(boolean[])
        * BitArray(int)
    
    """
    @typing.overload
    def __init__(self, bits: typing.List[bool]): ...
    @typing.overload
    def __init__(self, nbits: int): ...
    @typing.overload
    def __init__(self, wrapped: java.util.BitSet, length: int): ...
    def equals(self, obj: typing.Any) -> bool: ...
    def getBit(self, index: int) -> bool: ...
    def iterator(self) -> java.util.Iterator[bool]: ...
    def setBit(self, index: int, value: bool) -> None: ...
    def size(self) -> int: ...
    def toBinaryString(self) -> java.lang.String: ...
    def toString(self) -> java.lang.String: ...

class ModbusBitUtilities(java.lang.Object):
    """
    Java class 'org.openhab.core.io.transport.modbus.ModbusBitUtilities'
    
        Extends:
            java.lang.Object
    
      Constructors:
        * ModbusBitUtilities()
    
    """
    def __init__(self): ...
    @classmethod
    def commandToRegisters(cls, command: org.openhab.core.types.Command, type: 'ModbusConstants.ValueType') -> 'ModbusRegisterArray': ...
    @classmethod
    @typing.overload
    def extractBit(cls, bytes: typing.List[int], index: int) -> int: ...
    @classmethod
    @typing.overload
    def extractBit(cls, bytes: typing.List[int], registerIndex: int, bitIndexWithinRegister: int) -> int: ...
    @classmethod
    def extractFloat32(cls, bytes: typing.List[int], index: int) -> float: ...
    @classmethod
    def extractFloat32Swap(cls, bytes: typing.List[int], index: int) -> float: ...
    @classmethod
    def extractSInt16(cls, bytes: typing.List[int], index: int) -> int: ...
    @classmethod
    def extractSInt32(cls, bytes: typing.List[int], index: int) -> int: ...
    @classmethod
    def extractSInt32Swap(cls, bytes: typing.List[int], index: int) -> int: ...
    @classmethod
    def extractSInt64(cls, bytes: typing.List[int], index: int) -> int: ...
    @classmethod
    def extractSInt64Swap(cls, bytes: typing.List[int], index: int) -> int: ...
    @classmethod
    @typing.overload
    def extractSInt8(cls, bytes: typing.List[int], index: int) -> int: ...
    @classmethod
    @typing.overload
    def extractSInt8(cls, bytes: typing.List[int], registerIndex: int, hiByte: bool) -> int: ...
    @classmethod
    def extractStateFromRegisters(cls, registers: 'ModbusRegisterArray', index: int, type: 'ModbusConstants.ValueType') -> java.util.Optional[org.openhab.core.library.types.DecimalType]: ...
    @classmethod
    def extractStringFromBytes(cls, bytes: typing.List[int], byteIndex: int, length: int, charset: java.nio.charset.Charset) -> java.lang.String: ...
    @classmethod
    def extractStringFromRegisters(cls, registers: 'ModbusRegisterArray', registerIndex: int, length: int, charset: java.nio.charset.Charset) -> java.lang.String: ...
    @classmethod
    def extractUInt16(cls, bytes: typing.List[int], index: int) -> int: ...
    @classmethod
    def extractUInt32(cls, bytes: typing.List[int], index: int) -> int: ...
    @classmethod
    def extractUInt32Swap(cls, bytes: typing.List[int], index: int) -> int: ...
    @classmethod
    def extractUInt64(cls, bytes: typing.List[int], index: int) -> java.math.BigInteger: ...
    @classmethod
    def extractUInt64Swap(cls, bytes: typing.List[int], index: int) -> java.math.BigInteger: ...
    @classmethod
    @typing.overload
    def extractUInt8(cls, bytes: typing.List[int], index: int) -> int: ...
    @classmethod
    @typing.overload
    def extractUInt8(cls, bytes: typing.List[int], registerIndex: int, hiByte: bool) -> int: ...
    @classmethod
    def translateCommand2Boolean(cls, command: org.openhab.core.types.Command) -> java.util.Optional[bool]: ...

class ModbusCommunicationInterface(java.lang.AutoCloseable):
    """
    Java class 'org.openhab.core.io.transport.modbus.ModbusCommunicationInterface'
    
        Interfaces:
            java.lang.AutoCloseable
    
    """
    def close(self) -> None: ...
    def getEndpoint(self) -> org.openhab.core.io.transport.modbus.endpoint.ModbusSlaveEndpoint: ...
    def registerRegularPoll(self, request: 'ModbusReadRequestBlueprint', pollPeriodMillis: int, initialDelayMillis: int, resultCallback: 'ModbusReadCallback', failureCallback: typing.Union['ModbusFailureCallback'['ModbusReadRequestBlueprint'], typing.Callable[[], 'ModbusReadRequestBlueprint']]) -> 'PollTask': ...
    def submitOneTimePoll(self, request: 'ModbusReadRequestBlueprint', resultCallback: 'ModbusReadCallback', failureCallback: typing.Union['ModbusFailureCallback'['ModbusReadRequestBlueprint'], typing.Callable[[], 'ModbusReadRequestBlueprint']]) -> java.util.concurrent.Future[typing.Any]: ...
    def submitOneTimeWrite(self, request: 'ModbusWriteRequestBlueprint', resultCallback: 'ModbusWriteCallback', failureCallback: typing.Union['ModbusFailureCallback'['ModbusWriteRequestBlueprint'], typing.Callable[[], 'ModbusWriteRequestBlueprint']]) -> java.util.concurrent.Future[typing.Any]: ...
    def unregisterRegularPoll(self, task: 'PollTask') -> bool: ...

class ModbusConstants(java.lang.Object):
    """
    Java class 'org.openhab.core.io.transport.modbus.ModbusConstants'
    
        Extends:
            java.lang.Object
    
      Constructors:
        * ModbusConstants()
    
      Attributes:
        MAX_BITS_READ_COUNT (int): final static field
        MAX_REGISTERS_READ_COUNT (int): final static field
        MAX_BITS_WRITE_COUNT (int): final static field
        MAX_REGISTERS_WRITE_COUNT (int): final static field
    
    """
    MAX_BITS_READ_COUNT: typing.ClassVar[int] = ...
    MAX_REGISTERS_READ_COUNT: typing.ClassVar[int] = ...
    MAX_BITS_WRITE_COUNT: typing.ClassVar[int] = ...
    MAX_REGISTERS_WRITE_COUNT: typing.ClassVar[int] = ...
    def __init__(self): ...
    class ValueType(java.lang.Enum[org.openhab.core.io.transport.modbus.ModbusConstants.ValueType]):
        """
        Java class 'org.openhab.core.io.transport.modbus.ModbusConstants$ValueType'
        
            Extends:
                java.lang.Enum
        
          Attributes:
            BIT (org.openhab.core.io.transport.modbus.ModbusConstants$ValueType): final static enum constant
            INT8 (org.openhab.core.io.transport.modbus.ModbusConstants$ValueType): final static enum constant
            UINT8 (org.openhab.core.io.transport.modbus.ModbusConstants$ValueType): final static enum constant
            INT16 (org.openhab.core.io.transport.modbus.ModbusConstants$ValueType): final static enum constant
            UINT16 (org.openhab.core.io.transport.modbus.ModbusConstants$ValueType): final static enum constant
            INT32 (org.openhab.core.io.transport.modbus.ModbusConstants$ValueType): final static enum constant
            UINT32 (org.openhab.core.io.transport.modbus.ModbusConstants$ValueType): final static enum constant
            FLOAT32 (org.openhab.core.io.transport.modbus.ModbusConstants$ValueType): final static enum constant
            INT64 (org.openhab.core.io.transport.modbus.ModbusConstants$ValueType): final static enum constant
            UINT64 (org.openhab.core.io.transport.modbus.ModbusConstants$ValueType): final static enum constant
            INT32_SWAP (org.openhab.core.io.transport.modbus.ModbusConstants$ValueType): final static enum constant
            UINT32_SWAP (org.openhab.core.io.transport.modbus.ModbusConstants$ValueType): final static enum constant
            FLOAT32_SWAP (org.openhab.core.io.transport.modbus.ModbusConstants$ValueType): final static enum constant
            INT64_SWAP (org.openhab.core.io.transport.modbus.ModbusConstants$ValueType): final static enum constant
            UINT64_SWAP (org.openhab.core.io.transport.modbus.ModbusConstants$ValueType): final static enum constant
        
        """
        BIT: typing.ClassVar['ModbusConstants.ValueType'] = ...
        INT8: typing.ClassVar['ModbusConstants.ValueType'] = ...
        UINT8: typing.ClassVar['ModbusConstants.ValueType'] = ...
        INT16: typing.ClassVar['ModbusConstants.ValueType'] = ...
        UINT16: typing.ClassVar['ModbusConstants.ValueType'] = ...
        INT32: typing.ClassVar['ModbusConstants.ValueType'] = ...
        UINT32: typing.ClassVar['ModbusConstants.ValueType'] = ...
        FLOAT32: typing.ClassVar['ModbusConstants.ValueType'] = ...
        INT64: typing.ClassVar['ModbusConstants.ValueType'] = ...
        UINT64: typing.ClassVar['ModbusConstants.ValueType'] = ...
        INT32_SWAP: typing.ClassVar['ModbusConstants.ValueType'] = ...
        UINT32_SWAP: typing.ClassVar['ModbusConstants.ValueType'] = ...
        FLOAT32_SWAP: typing.ClassVar['ModbusConstants.ValueType'] = ...
        INT64_SWAP: typing.ClassVar['ModbusConstants.ValueType'] = ...
        UINT64_SWAP: typing.ClassVar['ModbusConstants.ValueType'] = ...
        @classmethod
        def fromConfigValue(cls, configValueType: java.lang.String) -> 'ModbusConstants.ValueType': ...
        def getBits(self) -> int: ...
        def getConfigValue(self) -> java.lang.String: ...
        def toString(self) -> java.lang.String: ...
        _valueOf_0__T = typing.TypeVar('_valueOf_0__T', bound=java.lang.Enum)  # <T>
        @classmethod
        @typing.overload
        def valueOf(cls, class_: typing.Type[_valueOf_0__T], string: java.lang.String) -> _valueOf_0__T: ...
        @classmethod
        @typing.overload
        def valueOf(cls, name: java.lang.String) -> 'ModbusConstants.ValueType': ...
        @classmethod
        def values(cls) -> typing.List['ModbusConstants.ValueType']: ...

_ModbusFailureCallback__R = typing.TypeVar('_ModbusFailureCallback__R')  # <R>
class ModbusFailureCallback(java.lang.Object, typing.Generic[_ModbusFailureCallback__R]):
    """
    :class:`~org.openhab.core.io.transport.modbus.https:.docs.oracle.com.en.java.javase.11.docs.api.java.base.java.lang.FunctionalInterface?is` @NonNullByDefault public interface ModbusFailureCallback<R>
    
        Callback used to report failure in Modbus
    
    
    """
    def handle(self, failure: AsyncModbusFailure[_ModbusFailureCallback__R]) -> None: ...

class ModbusManager(java.lang.Object):
    """
    @NonNullByDefault public interface ModbusManager
    
        ModbusManager is the main interface for interacting with Modbus slaves
    
    
    """
    def getEndpointPoolConfiguration(self, endpoint: org.openhab.core.io.transport.modbus.endpoint.ModbusSlaveEndpoint) -> org.openhab.core.io.transport.modbus.endpoint.EndpointPoolConfiguration: ...
    def newModbusCommunicationInterface(self, endpoint: org.openhab.core.io.transport.modbus.endpoint.ModbusSlaveEndpoint, configuration: org.openhab.core.io.transport.modbus.endpoint.EndpointPoolConfiguration) -> ModbusCommunicationInterface: ...

class ModbusReadFunctionCode(java.lang.Enum[org.openhab.core.io.transport.modbus.ModbusReadFunctionCode]):
    """
    Java class 'org.openhab.core.io.transport.modbus.ModbusReadFunctionCode'
    
        Extends:
            java.lang.Enum
    
      Attributes:
        READ_COILS (org.openhab.core.io.transport.modbus.ModbusReadFunctionCode): final static enum constant
        READ_INPUT_DISCRETES (org.openhab.core.io.transport.modbus.ModbusReadFunctionCode): final static enum constant
        READ_MULTIPLE_REGISTERS (org.openhab.core.io.transport.modbus.ModbusReadFunctionCode): final static enum constant
        READ_INPUT_REGISTERS (org.openhab.core.io.transport.modbus.ModbusReadFunctionCode): final static enum constant
    
    """
    READ_COILS: typing.ClassVar['ModbusReadFunctionCode'] = ...
    READ_INPUT_DISCRETES: typing.ClassVar['ModbusReadFunctionCode'] = ...
    READ_MULTIPLE_REGISTERS: typing.ClassVar['ModbusReadFunctionCode'] = ...
    READ_INPUT_REGISTERS: typing.ClassVar['ModbusReadFunctionCode'] = ...
    _valueOf_0__T = typing.TypeVar('_valueOf_0__T', bound=java.lang.Enum)  # <T>
    @classmethod
    @typing.overload
    def valueOf(cls, class_: typing.Type[_valueOf_0__T], string: java.lang.String) -> _valueOf_0__T: ...
    @classmethod
    @typing.overload
    def valueOf(cls, name: java.lang.String) -> 'ModbusReadFunctionCode': ...
    @classmethod
    def values(cls) -> typing.List['ModbusReadFunctionCode']: ...

class ModbusReadRequestBlueprint(java.lang.Object):
    """
    Java class 'org.openhab.core.io.transport.modbus.ModbusReadRequestBlueprint'
    
        Extends:
            java.lang.Object
    
      Constructors:
        * ModbusReadRequestBlueprint(int, org.openhab.core.io.transport.modbus.ModbusReadFunctionCode, int, int, int)
    
    """
    def __init__(self, slaveId: int, functionCode: ModbusReadFunctionCode, start: int, length: int, maxTries: int): ...
    def equals(self, obj: typing.Any) -> bool: ...
    def getDataLength(self) -> int: ...
    def getFunctionCode(self) -> ModbusReadFunctionCode: ...
    def getMaxTries(self) -> int: ...
    def getProtocolID(self) -> int: ...
    def getReference(self) -> int: ...
    def getUnitID(self) -> int: ...
    def hashCode(self) -> int: ...
    def toString(self) -> java.lang.String: ...

class ModbusRegisterArray(java.lang.Object):
    """
    Java class 'org.openhab.core.io.transport.modbus.ModbusRegisterArray'
    
        Extends:
            java.lang.Object
    
      Constructors:
        * ModbusRegisterArray(byte[])
        * ModbusRegisterArray(int[])
    
    """
    @typing.overload
    def __init__(self, bytes: typing.List[int]): ...
    @typing.overload
    def __init__(self, registerValues: typing.List[int]): ...
    def getBytes(self) -> typing.List[int]: ...
    def getRegister(self, i: int) -> int: ...
    def size(self) -> int: ...
    def toHexString(self) -> java.lang.String: ...
    def toString(self) -> java.lang.String: ...

class ModbusResponse(java.lang.Object):
    """
    @NonNullByDefault public interface ModbusResponse
    
        Minimal representation of a modbus response. Only function code is exposed, which allows detecting MODBUS exception
        codes from normal codes.
    
    
    """
    def getFunctionCode(self) -> int: ...

class ModbusResultCallback(java.lang.Object):
    """
    @NonNullByDefault public interface ModbusResultCallback
    
        Base interface for callbacks used in Modbus
    
    
    """

class ModbusWriteFunctionCode(java.lang.Enum[org.openhab.core.io.transport.modbus.ModbusWriteFunctionCode]):
    """
    Java class 'org.openhab.core.io.transport.modbus.ModbusWriteFunctionCode'
    
        Extends:
            java.lang.Enum
    
      Attributes:
        WRITE_COIL (org.openhab.core.io.transport.modbus.ModbusWriteFunctionCode): final static enum constant
        WRITE_MULTIPLE_COILS (org.openhab.core.io.transport.modbus.ModbusWriteFunctionCode): final static enum constant
        WRITE_SINGLE_REGISTER (org.openhab.core.io.transport.modbus.ModbusWriteFunctionCode): final static enum constant
        WRITE_MULTIPLE_REGISTERS (org.openhab.core.io.transport.modbus.ModbusWriteFunctionCode): final static enum constant
    
    """
    WRITE_COIL: typing.ClassVar['ModbusWriteFunctionCode'] = ...
    WRITE_MULTIPLE_COILS: typing.ClassVar['ModbusWriteFunctionCode'] = ...
    WRITE_SINGLE_REGISTER: typing.ClassVar['ModbusWriteFunctionCode'] = ...
    WRITE_MULTIPLE_REGISTERS: typing.ClassVar['ModbusWriteFunctionCode'] = ...
    @classmethod
    def fromFunctionCode(cls, functionCode: int) -> 'ModbusWriteFunctionCode': ...
    def getFunctionCode(self) -> int: ...
    _valueOf_0__T = typing.TypeVar('_valueOf_0__T', bound=java.lang.Enum)  # <T>
    @classmethod
    @typing.overload
    def valueOf(cls, class_: typing.Type[_valueOf_0__T], string: java.lang.String) -> _valueOf_0__T: ...
    @classmethod
    @typing.overload
    def valueOf(cls, name: java.lang.String) -> 'ModbusWriteFunctionCode': ...
    @classmethod
    def values(cls) -> typing.List['ModbusWriteFunctionCode']: ...

class ModbusWriteRequestBlueprint(java.lang.Object):
    """
    Java class 'org.openhab.core.io.transport.modbus.ModbusWriteRequestBlueprint'
    
        Extends:
            java.lang.Object
    
      Constructors:
        * ModbusWriteRequestBlueprint()
    
    """
    def __init__(self): ...
    def accept(self, visitor: 'ModbusWriteRequestBlueprintVisitor') -> None: ...
    def getFunctionCode(self) -> ModbusWriteFunctionCode: ...
    def getMaxTries(self) -> int: ...
    def getProtocolID(self) -> int: ...
    def getReference(self) -> int: ...
    def getUnitID(self) -> int: ...

class ModbusWriteRequestBlueprintVisitor(java.lang.Object):
    """
    @NonNullByDefault public interface ModbusWriteRequestBlueprintVisitor
    
    
        ModbusWriteRequestBlueprintVisitor interface.
    
    
    """
    @typing.overload
    def visit(self, blueprint: 'ModbusWriteCoilRequestBlueprint') -> None: ...
    @typing.overload
    def visit(self, blueprint: 'ModbusWriteRegisterRequestBlueprint') -> None: ...

_TaskWithEndpoint__R = typing.TypeVar('_TaskWithEndpoint__R')  # <R>
_TaskWithEndpoint__C = typing.TypeVar('_TaskWithEndpoint__C', bound=ModbusResultCallback)  # <C>
_TaskWithEndpoint__F = typing.TypeVar('_TaskWithEndpoint__F', bound=ModbusFailureCallback)  # <F>
class TaskWithEndpoint(java.lang.Object, typing.Generic[_TaskWithEndpoint__R, _TaskWithEndpoint__C, _TaskWithEndpoint__F]):
    """
    @NonNullByDefault public interface TaskWithEndpoint<R,​C extends :class:`~org.openhab.core.io.transport.modbus.ModbusResultCallback`,​F extends :class:`~org.openhab.core.io.transport.modbus.ModbusFailureCallback`<R>&gt;
    
        Common base interface for read and write tasks.
    
    
    """
    def getEndpoint(self) -> org.openhab.core.io.transport.modbus.endpoint.ModbusSlaveEndpoint: ...
    def getFailureCallback(self) -> _TaskWithEndpoint__F: ...
    def getMaxTries(self) -> int: ...
    def getRequest(self) -> _TaskWithEndpoint__R: ...
    def getResultCallback(self) -> _TaskWithEndpoint__C: ...

class ValueBuffer(java.lang.Object):
    """
    Java class 'org.openhab.core.io.transport.modbus.ValueBuffer'
    
        Extends:
            java.lang.Object
    
    """
    def array(self) -> typing.List[int]: ...
    def get(self, dst: typing.List[int]) -> 'ValueBuffer': ...
    def getFloat32(self) -> float: ...
    def getFloat32Swap(self) -> float: ...
    def getSInt16(self) -> int: ...
    def getSInt32(self) -> int: ...
    def getSInt32Swap(self) -> int: ...
    def getSInt64(self) -> int: ...
    def getSInt64Swap(self) -> int: ...
    def getSInt8(self) -> int: ...
    def getUInt16(self) -> int: ...
    def getUInt32(self) -> int: ...
    def getUInt32Swap(self) -> int: ...
    def getUInt64(self) -> java.math.BigInteger: ...
    def getUInt64Swap(self) -> java.math.BigInteger: ...
    def getUInt8(self) -> int: ...
    def hasRemaining(self) -> bool: ...
    def mark(self) -> 'ValueBuffer': ...
    @typing.overload
    def position(self) -> int: ...
    @typing.overload
    def position(self, byteIndex: int) -> 'ValueBuffer': ...
    def remaining(self) -> int: ...
    def reset(self) -> 'ValueBuffer': ...
    @classmethod
    @typing.overload
    def wrap(cls, array: typing.List[int]) -> 'ValueBuffer': ...
    @classmethod
    @typing.overload
    def wrap(cls, array: ModbusRegisterArray) -> 'ValueBuffer': ...

class ModbusReadCallback(ModbusResultCallback):
    """
    Java class 'org.openhab.core.io.transport.modbus.ModbusReadCallback'
    
        Interfaces:
            org.openhab.core.io.transport.modbus.ModbusResultCallback
    
    """
    def handle(self, result: AsyncModbusReadResult) -> None: ...

class ModbusWriteCallback(ModbusResultCallback):
    """
    Java class 'org.openhab.core.io.transport.modbus.ModbusWriteCallback'
    
        Interfaces:
            org.openhab.core.io.transport.modbus.ModbusResultCallback
    
    """
    def handle(self, result: AsyncModbusWriteResult) -> None: ...

class ModbusWriteCoilRequestBlueprint(ModbusWriteRequestBlueprint):
    """
    Java class 'org.openhab.core.io.transport.modbus.ModbusWriteCoilRequestBlueprint'
    
        Extends:
            org.openhab.core.io.transport.modbus.ModbusWriteRequestBlueprint
    
      Constructors:
        * ModbusWriteCoilRequestBlueprint(int, int, org.openhab.core.io.transport.modbus.BitArray, boolean, int)
        * ModbusWriteCoilRequestBlueprint(int, int, boolean, boolean, int)
    
    """
    @typing.overload
    def __init__(self, slaveId: int, reference: int, data: bool, writeMultiple: bool, maxTries: int): ...
    @typing.overload
    def __init__(self, slaveId: int, reference: int, data: BitArray, writeMultiple: bool, maxTries: int): ...
    def accept(self, visitor: ModbusWriteRequestBlueprintVisitor) -> None: ...
    def getCoils(self) -> BitArray: ...
    def getFunctionCode(self) -> ModbusWriteFunctionCode: ...
    def getMaxTries(self) -> int: ...
    def getReference(self) -> int: ...
    def getUnitID(self) -> int: ...
    def toString(self) -> java.lang.String: ...

class ModbusWriteRegisterRequestBlueprint(ModbusWriteRequestBlueprint):
    """
    Java class 'org.openhab.core.io.transport.modbus.ModbusWriteRegisterRequestBlueprint'
    
        Extends:
            org.openhab.core.io.transport.modbus.ModbusWriteRequestBlueprint
    
      Constructors:
        * ModbusWriteRegisterRequestBlueprint(int, int, org.openhab.core.io.transport.modbus.ModbusRegisterArray, boolean, int)
    
      Raises:
        java.lang.IllegalArgumentException: from java
    
    """
    def __init__(self, slaveId: int, reference: int, registers: ModbusRegisterArray, writeMultiple: bool, maxTries: int): ...
    def accept(self, visitor: ModbusWriteRequestBlueprintVisitor) -> None: ...
    def getFunctionCode(self) -> ModbusWriteFunctionCode: ...
    def getMaxTries(self) -> int: ...
    def getReference(self) -> int: ...
    def getRegisters(self) -> ModbusRegisterArray: ...
    def getUnitID(self) -> int: ...
    def toString(self) -> java.lang.String: ...

class PollTask(TaskWithEndpoint[ModbusReadRequestBlueprint, ModbusReadCallback, ModbusFailureCallback[ModbusReadRequestBlueprint]]):
    """
    Java class 'org.openhab.core.io.transport.modbus.PollTask'
    
        Interfaces:
            org.openhab.core.io.transport.modbus.TaskWithEndpoint
    
    """
    def getMaxTries(self) -> int: ...

class WriteTask(TaskWithEndpoint[ModbusWriteRequestBlueprint, ModbusWriteCallback, ModbusFailureCallback[ModbusWriteRequestBlueprint]]):
    """
    Java class 'org.openhab.core.io.transport.modbus.WriteTask'
    
        Interfaces:
            org.openhab.core.io.transport.modbus.TaskWithEndpoint
    
    """
    def getMaxTries(self) -> int: ...
