function setupPaperJs(fieldType = "nexperia"){
    let canvas = document.getElementById('myCanvas');
    paper.setup(canvas);

    // Draw background
    let background = new paper.Path.Rectangle({
        point: [0, 0],
        size: [paper.view.size.width, paper.view.size.height],
        fillColor: '#00b81b'
    });

    // Draw correct field
    let field;
    switch (fieldType) {
        case FIELD_TYPES.DEMO23:
            field = drawDemo23(paper);
            break;
        case FIELD_TYPES.FULL96:
            field = drawFull96(paper);
            break;
        case FIELD_TYPES.NEXPERIA:
        default:
            field = drawDemoNexperia(paper);
            break;

    }

    let getBounds = (f = field) => field.children[0].bounds;

    // Draw ball, ballLine, attacker, keeper
    let ball = new paper.Shape.Circle({
        center : [getBounds().center.x - 20, getBounds().center.y],
        radius : 2,
        fillColor : "orange"
    });
    let ballLine = new paper.Path([getBounds().center, getBounds().leftCenter]);
    let attacker = new paper.Shape.Circle({
        center : getBounds().center,
        radius : 9,
        fillColor : "black"
    });
    let keeper = new paper.Shape.Circle({
        center : [getBounds().leftCenter.x + 20, getBounds().center.y],
        radius : 9,
        fillColor : "black"
    });

    // Draw
    paper.view.draw();

    // onMouse events
    keeper.onMouseMove = field.onMouseMove = function(e){

        keeper.position = e.point;

        if(keeper.position.x - 9 < getBounds().leftCenter.x)   keeper.position.x = getBounds().leftCenter.x + 9;
        if(getBounds().rightCenter.x < keeper.position.x + 9)  keeper.position.x = getBounds().rightCenter.x - 9;
        if(keeper.position.y - 9 < getBounds().topCenter.y)    keeper.position.y = getBounds().topCenter.y + 9;
        if(getBounds().bottomCenter.y < keeper.position.y + 9) keeper.position.y = getBounds().bottomCenter.y - 9
    };

    let clickedOnce = false;
    ballLine.onMouseDown = keeper.onMouseDown = field.onMouseDown = function(e){
        if(clickedOnce){
            storeClick({
                r : attacker.rot,
                x : attacker.position.x - 70,
                y : attacker.position.y - 70
            },{
                x : keeper.position.x - 70,
                y : keeper.position.y - 70
            },{
                w : getBounds().width,
                h : getBounds().height
            })
        }
        clickedOnce = true;

        let w = getBounds().width - 18;
        let h = getBounds().height - 18;

        let attackerX = Math.round(Math.random() * w) + getBounds().topLeft.x + 9;
        let attackerY = Math.round(Math.random() * h) + getBounds().topLeft.y + 9;

        let rotation
        // Make sure that the robot at least aims towards the goals most of the time
        if(Math.random() < 0.5)
            rotation = 3/4 * Math.PI + Math.random() * (Math.PI/2);
        else
            rotation = Math.random() * Math.PI * 2;

        attacker.position = new paper.Point([attackerX, attackerY]);
        attacker.rot = rotation;    // Doesn't do anything for Paperjs, but its nice to store everything on attacker

        let _x = attackerX + Math.cos(rotation) * 15;
        let _y = attackerY - Math.sin(rotation) * 15;

        ball.position.x = _x;
        ball.position.y = _y;

        _x = attackerX + Math.cos(rotation) * 1000;
        _y = attackerY - Math.sin(rotation) * 1000;

        ballLine.removeSegments();
        ballLine.addSegments([
            [attackerX, attackerY],
            [_x, _y]
        ]);
        ballLine.strokeColor = "red"
    };

    return paper
}

function drawDemoNexperia(paper){

    // draw outer lines
    let field = new paper.Path.Rectangle({
        point : [70, 70],
        size : [250, 170],
        fillColor: "#009a19"
    });

    // draw goal 1
    let goal1 = new paper.Path.Rectangle({
        point: [field.bounds.leftCenter.x , field.bounds.leftCenter.y - 50],
        size : [-15, 100]
    });

    /* Draw center lines */
    let fieldGroup = new paper.Group(
        field, goal1
    );

    fieldGroup.style = {
        strokeColor : "white"
    };


    return fieldGroup
}

function drawDemo23(paper){

    // draw outer lines
    let field = new paper.Path.Rectangle({
        point : [70, 70],
        size : [300, 200],
        fillColor: "#009a19"
    });

    // draw goal 1
    let goal1 = new paper.Path.Rectangle({
        point: [field.bounds.leftCenter.x , field.bounds.leftCenter.y - 50],
        size : [-15, 100]
    });

    /* Draw center lines */
    let fieldGroup = new paper.Group(
        field, goal1
    );

    fieldGroup.style = {
        strokeColor : "white"
    };

    return fieldGroup
}

function drawFull96(paper){

    // draw field
    let field = new paper.Path.Rectangle({
        point : [70, 70],
        size : [900, 600],
        fillColor: "#009a19"
    });

    // draw goal 1
    let goal1 = new paper.Path.Rectangle({
        point: [field.bounds.leftCenter.x , field.bounds.leftCenter.y - 50],
        size : [-15, 100]
    });

    // draw goal 2
    let goal2 = new paper.Path.Rectangle({
        point: [field.bounds.rightCenter.x , field.bounds.rightCenter.y - 50],
        size : [15, 100]
    });

    let arc1_1, line1, arc1_2;

    /* Draw Defence Area 1 */
    {
        let _x = field.bounds.leftCenter.x;
        let _y = field.bounds.leftCenter.y;
        let _offset = 100 * (Math.sqrt(2) / 2);

        /* === Arc 1 === */
        let arc1_s = new paper.Point(_x, _y - 25 - 100);
        let arc1_t = new paper.Point(_x + _offset, _y - 25 - _offset);
        let arc1_e = new paper.Point(_x + 100, _y - 25);
        arc1_1 = new paper.Path.Arc(arc1_s, arc1_t, arc1_e);

        /* === Small white piece === */
        line1 = new paper.Path({
            segments: [[_x + 100, _y - 25], [_x + 100, _y + 25]],
        });

        /* === Arc 2 === */
        let arc2_s = new paper.Point(_x, _y + 25 + 100);
        let arc2_t = new paper.Point(_x + _offset, _y + 25 + _offset);
        let arc2_e = new paper.Point(_x + 100, _y + 25);
        arc1_2 = new paper.Path.Arc(arc2_s, arc2_t, arc2_e);
    }

    let arc2_1, line2, arc2_2;
    /* Draw Defence Area 1 */
    {
        let _x = field.bounds.rightCenter.x;
        let _y = field.bounds.rightCenter.y;
        let _offset = 100 * (Math.sqrt(2) / 2);

        /* === Arc 1 === */
        let arc1_s = new paper.Point(_x, _y - 25 - 100);
        let arc1_t = new paper.Point(_x - _offset, _y - 25 - _offset);
        let arc1_e = new paper.Point(_x - 100, _y - 25);
        arc2_1 = new paper.Path.Arc(arc1_s, arc1_t, arc1_e);

        /* === Small white piece === */
        line2 = new paper.Path({
            segments: [[_x - 100, _y - 25], [_x - 100, _y + 25]],
        });

        /* === Arc 2 === */
        let arc2_s = new paper.Point(_x, _y + 25 + 100);
        let arc2_t = new paper.Point(_x - _offset, _y + 25 + _offset);
        let arc2_e = new paper.Point(_x - 100, _y + 25);
        arc2_2 = new paper.Path.Arc(arc2_s, arc2_t, arc2_e);
    }

    /* Draw center lines */
    let lineHor = new paper.Path({
        segments : [field.bounds.leftCenter, field.bounds.rightCenter],
    });

    let lineVer = new paper.Path({
        segments : [field.bounds.topCenter, field.bounds.bottomCenter],
    });

    /* Draw center circle */
    let centerCircle = new paper.Shape.Circle({
        center : field.bounds.center,
        radius : 50,
    });

    let fieldGroup = new paper.Group(
        field,
        goal1, arc1_1, line1, arc1_2,
        goal2, arc2_1, line2, arc2_2,
        lineHor, lineVer, centerCircle
    );

    fieldGroup.style.strokeColor = "white";

    return fieldGroup

}