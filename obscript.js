const top_sub = 70;
const cell_size_y = 50;
var current_week = 27;
var search_btn = document.getElementById('search-btn');
search_btn.addEventListener('click', search);
document.getElementById("prev_week_btn").addEventListener('click', decreaseweek)
document.getElementById("next_week_btn").addEventListener('click', increaseweek)
document.getElementById("download_btn").addEventListener('click',download_data)
document.getElementById("current_week").innerText=`Tuần: ${current_week}`
async function getdata() {
    await fetch("data/20212.json")
        .then(response => response.json())
        .then(json => {
            data = json
            for (var key in data)
                rs.push(data[key])
            loadsearchresult(rs.slice(0, 100))
        });
}
var data
getdata();
var rs = []
var addedclasses = [];
var sessionFilter = document.getElementById("session_filter");
sessionFilter.addEventListener("change", search);
var dayFilter = document.getElementById("day_filter");
dayFilter.addEventListener("change", search);
function search() {

    document.getElementById("search_result_list").innerHTML = `<div class="loading_screen">
    Đang tải dữ liệu
    </div>
    <div class="loading_icon_tab">
    <div class="loading_icon">
        <i class="fas fa-spinner loading_icon_spiner"></i>
    </div>
</div>`
    var select_keyword_filter = document.getElementById("select_keyword_filter").value
    var keyword = document.getElementById("keyword").value.trim()
    var sessionfilter = document.getElementById("session_filter");
    var dayfilter = document.getElementById("day_filter");
    var res = [];
    if (keyword == "") {
        for (var key in data)
            res.push(data[key])
        res = res.slice(0, 100);
    }
    else if (select_keyword_filter === "classID") res = search_by_classID(keyword);
    else if (select_keyword_filter === "subjectname") res = search_by_subjectname(keyword);
    else if (select_keyword_filter === "subjectID") res = search_by_subjectID(keyword);
    if (dayfilter.value != "") {
        res = day_filter(res, dayfilter.value)
    }
    if (sessionfilter.value != "") {
        res = session_filter(res, sessionfilter.value)
    }


    loadsearchresult(res)

}

function loadsearchresult(res) {

    var result_list = document.getElementById("search_result_list");
    result_list.innerHTML = "";
    var htmls=``
    res.forEach(subject => {
        var htmlstring = `<li class="search_result_item">
        <div class="search_result_item_container">
            <div class="search__result-subject_name">${subject.subjectname}</div>
            <div style="display: flex;width: 100%;">
                <div style="width: 40%;padding-right: 10%;">
                    <div class="search__result-classID">Mã lớp: ${subject.classID}</div>
                    <div class="search__result-subjectID">Mã học phần: ${subject.subjectID}</div>
                    <div class="search__result-addclassID">Mã lớp kèm: ${subject.addclassID}</div>
                    <div class="search__result-volume">Tín chỉ: ${subject.volume}</div>
                    <div class="search__result-note">Ghi chú: ${subject.note}</div>
                </div>
                <div style="width: 40%;">
                    <div class="search__result-day">Thứ: ${subject.day.toString()}</div>
                    <div class="search__result-time">Thời gian: ${subject.time.toString()}</div>
                    <div class="search__result-week">Tuần: ${subject.week.toString()}</div>
                    <div class="search__result-room">Phòng học: ${subject.room.toString()}</div>
                    <div class="search__result-type">Loại lớp: ${subject.type.toString()}</div>
                </div>
            </div>
           
        </div>
        <div id="${subject.classID}" class="search__result__add-btn">
            <i class="fas fa-plus-circle"></i>
        </div>
    </li>`
         htmls+= htmlstring;
    })
    result_list.innerHTML = htmls;
    res.forEach(subject => {
        var btn = document.getElementById(subject.classID)
        btn.addEventListener('click', function () {
            selectclass(subject.classID);
        })
    })
}

function generate_subject_tab() {
    document.getElementById("time_table").innerHTML = "";
    addedclasses.forEach(id => {
        var subject = data[id];
        var colorID = addedclasses.indexOf(id);
        for (var i = 0; i < subject.day.length;i++) {
            htmlstring = `<div id="${subject.classID+subject.day[i]+subject.time[i]}subjecttab" class="day-${subject.day[i]}" style="top:${get_start_coord(subject.time[i])}px" >
        <div id="${subject.classID+subject.day[i]+subject.time[i]}tab" class="day_container subject-color-${colorID}" style="height:${get_time_span(subject.time[i])}px">
            <div class="subject_container">
                <div class="suject_tab_classname">${subject.subjectname}</div>
                <div class="suject_tab_classID">Mã lớp: ${subject.classID}</div>
                <div class="suject_tab_room">Phòng học: ${subject.room[i]}</div>   
            </div>

            
    </div>
    <div id="${subject.classID+subject.day[i]+subject.time[i]}toolkit" class="subject__toolkit__container">
            <div class="subject__toolkit">
                <div class="subject__toolkit-subject_name">${subject.subjectname}</div>
                <div class="subject__toolkit-detail">Mã lớp: ${subject.classID}</div>
                <div class="subject__toolkit-detail">Mã học phần: ${subject.subjectID}</div>
                <div class="subject__toolkit-detail">Mã lớp kèm: ${subject.addclassID}</div>
                <div class="subject__toolkit-detail">Tín chỉ: ${subject.volume}</div>
                <div class="subject__toolkit-detail">Ghi chú: ${subject.note}</div>
                <div class="subject__toolkit-detail">Thứ: ${subject.day[i]}</div>
                <div class="subject__toolkit-detail">Thời gian: ${subject.time[i]}</div>
                <div class="subject__toolkit-detail">Tuần: ${subject.week[i]}</div>
                <div class="subject__toolkit-detail">Phòng học: ${subject.room[i]}</div>
                <div class="subject__toolkit-detail">Loại lớp: ${subject.type[i]}</div>   
            </div>    
            </div>
    </div>
    
    </div>  `
        document.getElementById("time_table").innerHTML += htmlstring;
        }
    })
   
}
function load_week_view(current_week) {
    addedclasses.forEach(id => {
        var subject = data[id];
        for (var i = 0; i < subject.day.length; i++) { 
            if (subject.weekparse[i].includes(String(current_week))){
                console.log(`${subject.classID + subject.day[i] + subject.time[i]}subjecttab`)
                document.getElementById(`${subject.classID+subject.day[i]+subject.time[i]}subjecttab`).style.display = "block";
            }
            else {
                document.getElementById(`${subject.classID+subject.day[i]+subject.time[i]}subjecttab`).style.display = "none";
            }
        }
    })
}
function increaseweek()
{
    current_week++;
    document.getElementById("current_week").innerText=`Tuần: ${current_week}`
    load_week_view(current_week);
}
function decreaseweek()
{
    current_week--;
    document.getElementById("current_week").innerText=`Tuần: ${current_week}`
    load_week_view(current_week);
}
function check_select_class(classID)
{
    if (addedclasses.includes(classID)) {
        return [false,"Lớp này bạn chọn rồi màaa"];
    } else {
        var conf = check_conflict(classID)
        if (conf[0]) return [false, conf[1]];
    }
    return [true];
}
function check_conflict(classID1)
{
    let class1 = data[classID1];
    let time_list = {
        "2": [],
        "3": [],
        "4": [],
        "5": [],
        "6": [],
    };
    addedclasses.forEach(classID => {
        var subject = data[classID];
        for (var i = 0; i < subject.time.length; i++){
            time_list[subject.day[i]].push({ time:subject.time[i],classID:classID });
        }
    })

    for (var i = 0; i < class1.time.length; i++){
        if (time_list[class1.day[i]].length > 0) {
            for (var j = 0; j < time_list[class1.day[i]].length; j++){
                if (conflict(class1.time[i], time_list[class1.day[i]][j].time)) {
                    if(conflict_week(classID1,time_list[class1.day[i]][j].classID))
                    {return[true,`Bị trùng với mã lớp ${time_list[class1.day[i]][j].classID} rồi bạn ơi`];}
                }
            }          
        }
    }
    return [false];
}
function conflict(time1,time2) {
    let start1 = Number(time1.split("-")[0])
    let end1 = Number(time1.split("-")[1])
    let start2 = Number(time2.split("-")[0])
    let end2 = Number(time2.split("-")[1])
    if (start1 > end2) return false;
    if (start2 > end1) return false;
    return true;
}
function conflict_week(classID1,classID2) {
    var weeks1 = data[classID1].weekparse;
    var weeks2 = data[classID2].weekparse;
    for (var i = 0; i < weeks1.length; i++){
        for (var j = 0; j < weeks2.length; j++){
            console.log(weeks1[i])
            console.log(weeks2[j])
            for (var k = 0; k < weeks2[j].length; k++){
                if (weeks1[i].includes(weeks2[j][k])) return true;
            }
        }
    }
    return false;
}
function selectclass(classID) {

    var con = check_select_class(classID);
    if (con[0]) {
        addedclasses.push(classID);
        loadaddedclasslist();
        generate_subject_tab();
        add_subject_event();
        load_week_view(current_week);
    }
    else {
        // alert(con[1]);
        document.getElementById("alert_box").innerHTML=`<div id="alert_message" class="alert_message">
        <i class="fas fa-exclamation-circle"></i>
        <div class="alert_message_text">${con[1]}</div>
        <div class="sticker2" aria-label="Nhãn dán  no, cat shaking head no" role="img" tabindex="-1" style="background-image: url(&quot;https://scontent.xx.fbcdn.net/v/t39.1997-6/45170103_338938786925780_7120102551726325760_n.webp?_nc_cat=1&amp;ccb=1-3&amp;_nc_sid=0572db&amp;_nc_ohc=UwQJ3UU9DpcAX9HuFJ4&amp;_nc_ad=z-m&amp;_nc_cid=0&amp;_nc_ht=scontent.xx&amp;oh=b7c19945ff82206841de415b3264cea3&amp;oe=60CE7216&quot;); background-repeat: no-repeat; background-size: 80px 80px; cursor: default; height: 80px; width: 80px;"></div>
    </div>`
        document.getElementById("alert_box").firstChild.style.display = "flex";
    }
    if (data[classID].classID != data[classID].addclassID) {
        selectclass(data[classID].addclassID)
    }
}

function add_subject_event() {
    addedclasses.forEach(id => {
        var subject = data[id];
        for (var i = 0; i < subject.day.length; i++) {
            let toolkit = document.getElementById(subject.classID + subject.day[i] + subject.time[i] + "toolkit")
            let tab=document.getElementById(subject.classID + subject.day[i] + subject.time[i] + "tab")
            tab.onmouseover = function () {
                toolkit.style.display = "block";
            }
            tab.onmouseout = function () {
                toolkit.style.display = "none";
            }
        }
        
    })
}

function removeclass(classID) {
    addedclasses.splice(addedclasses.indexOf(classID), 1);
    loadaddedclasslist();
    generate_subject_tab();
}
function loadaddedclasslist() {
    var added_list = document.getElementById('added_list');
    added_list.innerHTML = "";
    addedclasses.reverse().forEach(ID => {
        var subject = data[ID];
        var htmlstring = ` <li class="added_item">
    <div class="added_item_container">
        <div class="search__result-subject_name">${subject.subjectname}</div>
        <div style="display: flex;width: 100%;">
                <div class="search__result-classID">Mã lớp: ${subject.classID}</div>
                <div class="search__result-subjectID" style="padding-left:5px;">Mã học phần: ${subject.subjectID}</div>
        </div>
       
    </div>
    <div id="${subject.classID}remove" class="added__remove-btn">
    <i class="fas fa-times-circle"></i>
    </div>
    </li>`
        added_list.innerHTML += htmlstring;
    })
    addedclasses.reverse()
    addedclasses.forEach(ID => {
        var btn = document.getElementById(ID + "remove")
        btn.addEventListener('click', function () {
            removeclass(ID);
        })
    })
}
function search_by_classID(classID) {
    return [data[classID]];
}
function search_by_subjectID(subjectID) {
    var res = [];
    for (var key in data) {
        if (data[key].subjectID == subjectID.trim()) {
            res.push(data[key])
        }
    }
    return res;
}
function search_by_subjectname(subjectname) {
    var res = [];
    for (var key in data) {
        if (data[key].subjectname.toLowerCase().includes(subjectname.trim().toLowerCase())) {
            res.push(data[key])
        }
    }
    return res;
}
function session_filter(search_data, session) {
    var res = [];
    if (session == "1") {
        search_data.forEach(subject => {
            var added = false;
            subject.time.forEach(time => {
                if (Number(time.split("-")[0]) < 1200 && !added) {
                    res.push(subject);
                    added = true;
                }
            })
        })
    } else if (session == "2") {
        search_data.forEach(subject => {
            var added = false;
            subject.time.forEach(time => {
                if (Number(time.split("-")[0]) > 1200 && !added) {
                    res.push(subject);
                    added = true;
                }
            })
        })
    }

    return res;
}
function day_filter(search_data, day) {
    var res = [];

    search_data.forEach(subject => {
        if (subject.day.includes(day)) {
            res.push(subject);
        }
    })
    return res;
}
function get_start_coord(time){
    var timespan = time_minus(time.split("-")[0].trim(), "0600")
    return top_sub + timespan / 60 * cell_size_y;
}
function get_time_span(time) {
    var timespan = time_minus(time.split("-")[1].trim(), time.split("-")[0].trim())
    return timespan / 60 * cell_size_y;
}
function time_minus(time1, time2) {
        let h1 = parseInt(time1.substring(0,2))
        let m1 = parseInt(time1.substring(2,4))
        let h2 = parseInt(time2.substring(0,2))
        let m2 = parseInt(time2.substring(2,4))
        return (h1 - h2) * 60 + (m1 - m2);   
}
function download_data() {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + addedclasses.toString());
  element.setAttribute('download', "selected.txt");

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}