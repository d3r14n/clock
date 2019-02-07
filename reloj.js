var dates = [];

var now = new Date();
var year = now.getFullYear().toString();

var d =
[
    {
        "year": null,
        "month": "11",
        "day": "08",
        "time": "22:22:01"
    },
    {
        "year": null,
        "month": "08",
        "day": "06",
        "time": null
    },
    {
        "year": null,
        "month": "02",
        "day": "13",
        "time": null
    },
    {
        "year": null,
        "month": "06",
        "day": "15",
        "time": null
    },
    {
    	"year": "2019",
    	"month": "05",
    	"day": "24",
    	"time": "15:00:01"
    }
];

for (x = 0; x < d.length; x++)
{
    ny = d[x].year == null ? year : d[x].year;
    nt = d[x].time == null ? "00:00:01" : d[x].time;

    dates[x] = ny + "-" + d[x].month + "-" + d[x].day + "T" + nt;
}

var canvas;
var ctx;
var radius;

var romanNumbers = [null, "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];

var waitUntil = new Date(whichIsTheNextDate());

function startClock()
{
    canvas = document.getElementById("clock");
    ctx = canvas.getContext("2d");
    radius = canvas.height / 2;
    ctx.translate(radius, radius);
    radius = radius * 0.90
    setInterval(drawClock, 1000);
}

function drawClock()
{
    //document.getElementById('sound').play();
    drawFace(ctx, radius);
    drawNumbers(ctx, radius);
    drawTime(ctx, radius);
}

function drawFace(ctx, radius)
{
    var grad;
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, 2 * Math.PI);
    ctx.fillStyle = 'white';
    ctx.fill();
    grad = ctx.createRadialGradient(0, 0, radius * 0.95, 0, 0, radius * 1.05);
    grad.addColorStop(0, '#333');
    grad.addColorStop(0.5, 'white');
    grad.addColorStop(1, '#333');
    ctx.strokeStyle = grad;
    ctx.lineWidth = radius * 0.1;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.1, 0, 2 * Math.PI);
    ctx.fillStyle = '#333';
    ctx.fill();
}

function drawNumbers(ctx, radius)
{
    var ang;
    var num;
    ctx.font = radius * 0.15 + "px arial";
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    for (num = 1; num < 13; num++)
    {
        ang = num * Math.PI / 6;
        ctx.rotate(ang);
        ctx.translate(0, -radius * 0.85);
        ctx.rotate(-ang);
        ctx.fillText(romanNumbers[num], 0, 0);
        ctx.rotate(ang);
        ctx.translate(0, radius * 0.85);
        ctx.rotate(-ang);
    }
}

function drawTime(ctx, radius)
{
    now = new Date();
    hour = now.getHours();
    minute = now.getMinutes();
    second = now.getSeconds();

    hour = hour % 12;
    hour = (hour * Math.PI / 6) +
        (minute * Math.PI / (6 * 60)) +
        (second * Math.PI / (360 * 60));
    drawHand(ctx, hour, radius * 0.5, radius * 0.07);

    minute = (minute * Math.PI / 30) + (second * Math.PI / (30 * 60));
    drawHand(ctx, minute, radius * 0.8, radius * 0.07);

    second = (second * Math.PI / 30);
    drawHand(ctx, second, radius * 0.9, radius * 0.02);

    showTimeLeft(now);
}

function drawHand(ctx, pos, length, width)
{
    ctx.beginPath();
    ctx.lineWidth = width;
    ctx.lineCap = "round";
    ctx.moveTo(0, 0);
    ctx.rotate(pos);
    ctx.lineTo(0, -length);
    ctx.stroke();
    ctx.rotate(-pos);
}

function showTimeLeft(date)
{
    if (dateDiffInSeconds(now, waitUntil) > 0)
    {
        diff = dateDiffInDays(date, waitUntil);

        timeLeftTxt = document.getElementById("timeLeft");
        timeLeftTxt.innerHTML = "";

        if(diff.days == 1)
        {
            timeLeftTxt.innerHTML += diff.days + " day, ";
        }
        else
        {
            timeLeftTxt.innerHTML += diff.days + " days, ";
        }
        if (diff.hours == 1)
        {
            timeLeftTxt.innerHTML += diff.hours + " hour, ";
        }
        else
        {
            timeLeftTxt.innerHTML += diff.hours + " hours, ";
        }
        if (diff.minutes == 1)
        {
            timeLeftTxt.innerHTML += diff.minutes + " minute, ";
        }
        else
        {
            timeLeftTxt.innerHTML += diff.minutes + " minutes, ";
        }
        if (diff.seconds == 1)
        {
            timeLeftTxt.innerHTML += diff.seconds + " second ";
        }
        else
        {
            timeLeftTxt.innerHTML += diff.seconds + " seconds ";
        }
        timeLeftTxt.innerHTML += "left.";
    }
}

function dateDiffInDays(dateA, dateB)
{
    delta = Math.abs(dateB - dateA) / 1000;

    days = Math.floor(delta / 86400);
    delta -= days * 86400;

    hours = Math.floor(delta / 3600) % 24;
    delta -= hours * 3600;

    minutes = Math.floor(delta / 60) % 60;
    delta -= minutes * 60;

    seconds = Math.floor(delta % 60);

    difference =
    {
        "days": days,
        "hours": hours,
        "minutes": minutes,
        "seconds": seconds
    }

    return difference
}

function dateDiffInSeconds(dateA, dateB)
{
    dif = dateB.getTime() - dateA.getTime();
    seconds = dif / 1000;
    return seconds;
}

function whichIsTheNextDate()
{
    secondsTillNextDate = Infinity;
    nextDate = "3000-01-01T00:00:00";
    for (x = 0; x < dates.length; x++)
    {
        oneDate = new Date(dates[x]);
        if (dateDiffInSeconds(now, oneDate) < secondsTillNextDate && dateDiffInSeconds(now, oneDate) > 0)
        {
            secondsTillNextDate = dateDiffInSeconds(now, oneDate);
            nextDate = dates[x];
        }
    }
    return nextDate;
}