import java.lang
import org.openhab.core.io.transport.mqtt
import typing


class AbstractReconnectStrategy(java.lang.Object):
    """
    Java class 'org.openhab.core.io.transport.mqtt.reconnect.AbstractReconnectStrategy'
    
        Extends:
            java.lang.Object
    
      Constructors:
        * AbstractReconnectStrategy()
    
    """
    def __init__(self): ...
    def connectionEstablished(self) -> None: ...
    def getBrokerConnection(self) -> org.openhab.core.io.transport.mqtt.MqttBrokerConnection: ...
    def isReconnecting(self) -> bool: ...
    def lostConnection(self) -> None: ...
    def setBrokerConnection(self, mqttBrokerConnectionImpl: org.openhab.core.io.transport.mqtt.MqttBrokerConnection) -> None: ...
    def start(self) -> None: ...
    def stop(self) -> None: ...

class PeriodicReconnectStrategy(AbstractReconnectStrategy):
    """
    Java class 'org.openhab.core.io.transport.mqtt.reconnect.PeriodicReconnectStrategy'
    
        Extends:
            org.openhab.core.io.transport.mqtt.reconnect.AbstractReconnectStrategy
    
      Constructors:
        * PeriodicReconnectStrategy(int, int)
        * PeriodicReconnectStrategy()
    
    """
    @typing.overload
    def __init__(self): ...
    @typing.overload
    def __init__(self, reconnectFrequency: int, firstReconnectAfter: int): ...
    def connectionEstablished(self) -> None: ...
    def getFirstReconnectAfter(self) -> int: ...
    def getReconnectFrequency(self) -> int: ...
    def isReconnecting(self) -> bool: ...
    def isStarted(self) -> bool: ...
    def lostConnection(self) -> None: ...
    def start(self) -> None: ...
    def stop(self) -> None: ...
