import java.lang
import java.net
import java.time
import java.util
import org.openhab.core.config.core
import org.openhab.core.ephemeris
import org.openhab.core.i18n
import typing


class EphemerisManagerImpl(org.openhab.core.ephemeris.EphemerisManager, org.openhab.core.config.core.ConfigOptionProvider):
    """
    Java class 'org.openhab.core.ephemeris.internal.EphemerisManagerImpl'
    
        Extends:
            java.lang.Object
    
        Interfaces:
            org.openhab.core.ephemeris.EphemerisManager,
            org.openhab.core.config.core.ConfigOptionProvider
    
      Constructors:
        * EphemerisManagerImpl(org.openhab.core.i18n.LocaleProvider)
    
      Attributes:
        CONFIG_DAYSET_PREFIX (java.lang.String): final static field
        CONFIG_DAYSET_WEEKEND (java.lang.String): final static field
        CONFIG_COUNTRY (java.lang.String): final static field
        CONFIG_REGION (java.lang.String): final static field
        CONFIG_CITY (java.lang.String): final static field
    
    """
    CONFIG_DAYSET_PREFIX: typing.ClassVar[java.lang.String] = ...
    CONFIG_DAYSET_WEEKEND: typing.ClassVar[java.lang.String] = ...
    CONFIG_COUNTRY: typing.ClassVar[java.lang.String] = ...
    CONFIG_REGION: typing.ClassVar[java.lang.String] = ...
    CONFIG_CITY: typing.ClassVar[java.lang.String] = ...
    def __init__(self, localeProvider: org.openhab.core.i18n.LocaleProvider): ...
    @typing.overload
    def getBankHolidayName(self, date: java.time.ZonedDateTime) -> java.lang.String: ...
    @typing.overload
    def getBankHolidayName(self, date: java.time.ZonedDateTime, filename: java.lang.String) -> java.lang.String: ...
    @typing.overload
    def getBankHolidayName(self, date: java.time.ZonedDateTime, resource: java.net.URL) -> java.lang.String: ...
    @typing.overload
    def getDaysUntil(self, from_: java.time.ZonedDateTime, searchedHoliday: java.lang.String) -> int: ...
    @typing.overload
    def getDaysUntil(self, from_: java.time.ZonedDateTime, searchedHoliday: java.lang.String, filename: java.lang.String) -> int: ...
    @typing.overload
    def getDaysUntil(self, from_: java.time.ZonedDateTime, searchedHoliday: java.lang.String, resource: java.net.URL) -> int: ...
    def getHolidayDescription(self, holiday: java.lang.String) -> java.lang.String: ...
    @typing.overload
    def getNextBankHoliday(self, from_: java.time.ZonedDateTime) -> java.lang.String: ...
    @typing.overload
    def getNextBankHoliday(self, from_: java.time.ZonedDateTime, filename: java.lang.String) -> java.lang.String: ...
    @typing.overload
    def getNextBankHoliday(self, from_: java.time.ZonedDateTime, resource: java.net.URL) -> java.lang.String: ...
    def getParameterOptions(self, uri: java.net.URI, param: java.lang.String, context: java.lang.String, locale: java.util.Locale) -> java.util.Collection[org.openhab.core.config.core.ParameterOption]: ...
    @typing.overload
    def isBankHoliday(self, date: java.time.ZonedDateTime) -> bool: ...
    @typing.overload
    def isBankHoliday(self, date: java.time.ZonedDateTime, filename: java.lang.String) -> bool: ...
    @typing.overload
    def isBankHoliday(self, date: java.time.ZonedDateTime, resource: java.net.URL) -> bool: ...
    def isInDayset(self, daysetName: java.lang.String, date: java.time.ZonedDateTime) -> bool: ...
    def isWeekend(self, date: java.time.ZonedDateTime) -> bool: ...