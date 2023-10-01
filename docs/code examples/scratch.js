
src: = "/static/time-line-picker/index.html?transferItem=" + props.transfer_item + ((props.states) ? ("&states=" + props.states) : "") + "&yAxisLabel=" + ((props.axis_label) ? props.axis_label : "1,2,3,4,5,6,7") + (props.darkmode ? "&dark=" + props.darkmode : "") + (props.colorset ? "&colorset=" + props.colorset : "") + ((items[props.deactivation_item].state == 'ON') ? "&deactivation=true" : "&deactivation=false")

