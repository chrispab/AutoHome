<!-- For more information goto: https://github.com/BasvanH/habpanel-widget-openweathermap -->

    <link rel="stylesheet" type="text/css" href="/static/openweathermap/weather-icons-master/css/weather-icons.css">

<style>
@media (min-width: 992px) {
    .col-md-border:not(:last-child) {
			border-right: 1px solid #d7d7d7;
    }
    .col-md-border + .col-md-border {
			border-left: 1px solid #d7d7d7;
			margin-left: -1px;
    }
  	.owm-to-upper:first-letter {
    	text-transform: uppercase;
		}
  	.owm-condition {
  		height: 2em;
 		}
  	.owm-row-current {
  		margin: 1em 0em 2em;
 		}
   	.owm-row-forecast {
  		margin-bottom: 1em;
 		}
}
</style>
<div oc-lazy-load="['/static/openweathermap/owm.controller.js']">
	<div ng-controller="ngOwmCtrl">
    <div class="row owm-row-current">
      <div class="col-xs-9">
        <i class="wi wi-owm-{{ itemValue('Weather_OWM_ConditionId') }} pull-right" ng-style="{ 'color' : (config.icon_color_current == NULL ? primary-color : config.icon_color_current), 'font-size' : (config.icon_size_current == NULL ? '10em' : config.icon_size_current + 'em') }"></i>
        <h2 class="text-left owm-to-upper">{{ itemValue('Weather_OWM_Condition') }}</h2>
      </div>
      <div class="col-xs-3 text-right">
        <h2>{{ '%.1f' | sprintf:itemValue('Weather_OWM_Temperature').split(' ')[0] }} {{ itemValue('Weather_OWM_Temperature').split(' ')[1] }}</h2>
        <h5><img style="height:16px;" src="/static/openweathermap/images/humidity.png"/> {{itemValue('Weather_OWM_Humidity') }}</h5>
        <h5><img style="height:16px;" src="/static/openweathermap/images/wind.png"/> {{ '%.1f' | sprintf:itemValue('Weather_OWM_Wind_Speed').split(' ')[0] }} {{ itemValue('Weather_OWM_Wind_Speed').split(' ')[1] }}</h5>
        <h5>{{ itemValue('Weather_OWM_ObservationTime') | date: 'HH:mm' }}</h5>
      </div>
    </div>
    <div class="row owm-row-forecast">
      <div class="col-xs-3 col-md-border">
        <h4 class="owm-to-upper">{{ date_time0 | date:(config.day_format == NULL ? 'EEEE' : config.day_format) }}</h4>
        <i class="wi wi-owm-{{ condition_id0 }}" ng-style="{ 'color' : (config.icon_color_forecast == NULL) ? primary-color : config.icon_color_forecast, 'font-size' : (config.icon_size_forecast == NULL) ? '3em' : config.icon_size_forecast + 'em' }"></i>
        <h5 class="owm-condition owm-to-upper">{{ condition0 }}</h5>
        <h4><b>{{ temp0 == NULL ? '' : '%.1f' | sprintf:temp0.split(' ')[0]}} {{temp0.split(' ')[1] }}</b></h4>
      </div>
      <div class="col-xs-3 col-md-border">
        <h4 class="owm-to-upper">{{ date_time1 | date:(config.day_format == NULL ? 'EEEE' : config.day_format) }}</h4>
        <i class="wi wi-owm-{{ condition_id1 }}" ng-style="{ 'color' : (config.icon_color_forecast == NULL) ? primary-color : config.icon_color_forecast, 'font-size' : (config.icon_size_forecast == NULL) ? '3em' : config.icon_size_forecast + 'em' }"></i>
        <h5 class="owm-condition owm-to-upper">{{ condition1 }}</h5>
        <h4><b>{{ temp1 == NULL ? '' : '%.1f' | sprintf:temp1.split(' ')[0]}} {{temp1.split(' ')[1] }}</b></h4>
      </div>
      <div class="col-xs-3 col-md-border">
        <h4 class="owm-to-upper">{{ date_time2 | date:(config.day_format == NULL ? 'EEEE' : config.day_format) }}</h4>
        <i class="wi wi-owm-{{ condition_id2 }}" ng-style="{ 'color' : (config.icon_color_forecast == NULL) ? primary-color : config.icon_color_forecast, 'font-size' : (config.icon_size_forecast == NULL) ? '3em' : config.icon_size_forecast + 'em' }"></i>
        <h5 class="owm-condition owm-to-upper">{{ condition2 }}</h5>
        <h4><b>{{ temp2 == NULL ? '' : '%.1f' | sprintf:temp2.split(' ')[0]}} {{temp2.split(' ')[1] }}</b></h4>
      </div>
      <div class="col-xs-3 col-md-border">
        <h4 class="owm-to-upper">{{ date_time3 | date:(config.day_format == NULL ? 'EEEE' : config.day_format) }}</h4>
        <i class="wi wi-owm-{{ condition_id3 }}" ng-style="{ 'color' : (config.icon_color_forecast == NULL) ? primary-color : config.icon_color_forecast, 'font-size' : (config.icon_size_forecast == NULL) ? '3em' : config.icon_size_forecast + 'em' }"></i>
        <h5 class="owm-condition owm-to-upper">{{ condition3 }}</h5>
        <h4><b>{{ temp3 == NULL ? '' : '%.1f' | sprintf:temp3.split(' ')[0]}} {{temp3.split(' ')[1] }}</b></h4>
      </div>
    </div>
  </div>
</div>
