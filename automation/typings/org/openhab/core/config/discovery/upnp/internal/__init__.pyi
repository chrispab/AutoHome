import java.lang
import java.util
import org.jupnp.model.meta
import org.jupnp.registry
import org.openhab.core.config.discovery
import org.openhab.core.net
import org.openhab.core.thing
import typing


class UpnpDiscoveryService(org.openhab.core.config.discovery.AbstractDiscoveryService, org.jupnp.registry.RegistryListener, org.openhab.core.net.NetworkAddressChangeListener):
    """
    Java class 'org.openhab.core.config.discovery.upnp.internal.UpnpDiscoveryService'
    
        Extends:
            org.openhab.core.config.discovery.AbstractDiscoveryService
    
        Interfaces:
            org.jupnp.registry.RegistryListener,
            org.openhab.core.net.NetworkAddressChangeListener
    
      Constructors:
        * UpnpDiscoveryService()
    
    """
    def __init__(self): ...
    def afterShutdown(self) -> None: ...
    def beforeShutdown(self, registry: org.jupnp.registry.Registry) -> None: ...
    @typing.overload
    def getSupportedThingTypes(self) -> java.util.Collection: ...
    @typing.overload
    def getSupportedThingTypes(self) -> java.util.Set[org.openhab.core.thing.ThingTypeUID]: ...
    def localDeviceAdded(self, registry: org.jupnp.registry.Registry, device: org.jupnp.model.meta.LocalDevice) -> None: ...
    def localDeviceRemoved(self, registry: org.jupnp.registry.Registry, device: org.jupnp.model.meta.LocalDevice) -> None: ...
    def onChanged(self, added: java.util.List[org.openhab.core.net.CidrAddress], removed: java.util.List[org.openhab.core.net.CidrAddress]) -> None: ...
    def remoteDeviceAdded(self, registry: org.jupnp.registry.Registry, device: org.jupnp.model.meta.RemoteDevice) -> None: ...
    def remoteDeviceDiscoveryFailed(self, registry: org.jupnp.registry.Registry, device: org.jupnp.model.meta.RemoteDevice, ex: java.lang.Exception) -> None: ...
    def remoteDeviceDiscoveryStarted(self, registry: org.jupnp.registry.Registry, device: org.jupnp.model.meta.RemoteDevice) -> None: ...
    def remoteDeviceRemoved(self, registry: org.jupnp.registry.Registry, device: org.jupnp.model.meta.RemoteDevice) -> None: ...
    def remoteDeviceUpdated(self, registry: org.jupnp.registry.Registry, device: org.jupnp.model.meta.RemoteDevice) -> None: ...