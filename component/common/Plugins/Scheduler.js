import React, { Component } from 'react';
import 'dhtmlx-scheduler';
import 'dhtmlx-scheduler/codebase/dhtmlxscheduler_material.css';

const scheduler = window.scheduler;

export class SchedulerModal extends Component {
    componentDidMount() {
        // console.log(this.props, "dsfsdfgdfgsdfgsdf")
        let { events, onClick, onEmptyClick, handleChangeFilter, filterDate, filterType, onDeleteEvent, openDetail, openEdit, openStaffView } = this.props;
        scheduler.skin = 'material';
        scheduler.config.header = [
            'day',
            'week',
            'month',
            { html: "Staff", click: openStaffView },
            'date',
            'prev',
            'today',
            'next',
        ];

        scheduler.config.icons_select = [
            "icon_details"
        ];

        scheduler._click.buttons.details = function (id) {
            openDetail(id)
        };

        scheduler._click.buttons.edit = function (id) {
            openEdit(id)
        };

        scheduler.attachEvent("onBeforeViewChange", function (old_mode, old_date, mode, date) {
            if ((old_mode !== mode) || (old_date !== date)) {
                handleChangeFilter(old_mode, old_date, mode, date)
            }
            // console.log("namdfsfgsghsfghf", old_mode, old_date, mode, date)
            // }
            return true;
        });

        scheduler.init(this.schedulerContainer, filterDate, filterType);
        scheduler.clearAll();
        scheduler.config.collision_limit = 1;
        scheduler.config.resource_property = "user_id";
        scheduler.parse(
            events
        );
        scheduler.config.first_hour = 8;
        scheduler.config.last_hour = 22;
        scheduler.config.separate_short_events = false;
        scheduler.config.hour_size_px = 176;
       
        scheduler.attachEvent("onClick", function (id, e) {
            //any custom logic here
            onClick(id, e)
            console.log(id, "===afasfasdfdfasd=====  scheduler", e);
            return true;
        });

        scheduler.attachEvent("onCellDblClick", function (x_ind, y_ind, x_val, y_val, e) {
            //any custom logic here
            return false;
        })

        scheduler.attachEvent("onDblClick", function (id, e) {
            //any custom logic here
            return false;
        })

        scheduler.attachEvent("onEmptyClick", function (date, e) {
            onEmptyClick(date, e)
        });

        // scheduler.attachEvent("onEventDeleted", function(id,ev){
        //     onDeleteEvent(id, ev)
        //     console.log("===afasfasdfdfasd===== schedurer", id, ev);
        // });
         
        var format = scheduler.date.date_to_str("%H:%i");
        var step = 15;
         
        scheduler.templates.hour_scale = function(date){
            var html="";
            for (var i=0; i<60/step; i++){
                html+="<div class='dhx_scale_hour' style='height:44px;line-height:44px;'>"+ format(date) +"</div>";
                date = scheduler.date.add(date,step,"minute");
            }
            return html;
        }

        scheduler.templates.event_header = function (start, end, ev) {
            console.log("header=======", ev)
            // return scheduler.templates.event_date(start) + " - " + 
            // "<img  alt='Blockchain and its use cases'  src='https://doodle-website-live.s3.ap-south-1.amazonaws.com/production/img/5180f0e.png'></img>" +
            //     scheduler.templates.event_date(end)  + ` ` + ev.staff_name ;
            // return `${scheduler.templates.event_date(start) + " - " + scheduler.templates.event_date(end) + " " + ev.staff_name + "<img  alt='Blockchain and its use cases' width='22' style='position: absolute;height: 22px;right: 0px;border-radius: 10px;' src='https://doodle-website-live.s3.ap-south-1.amazonaws.com/production/img/5180f0e.png'></img>"}` ;

            return `${`<p>` + scheduler.templates.event_date(start) + " - " + scheduler.templates.event_date(end) + ' ' + ev.staff_name + `<img  alt=${ev.staff_name} width='22' style='position: absolute;height: 22px;right: 0;border-radius: 10px;' src=${ev.emp_pic}></img>` + `</p>` + `<p>` + ev.title + `</p>`}`;
        };

        // scheduler.filter_timeline = function (id, e) {
        //     //some_other code
        // }
    }

    render() {
        return (
            <div
                ref={(input) => { this.schedulerContainer = input }}
                style={{ width: '100%', height: '100%' }}
            ></div>
        );
    }
}