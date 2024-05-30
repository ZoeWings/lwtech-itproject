// each class represents an UI element
// each class creates / holds an HTML element
// each class will create / hold child components

// const { Popover } = require("./bootstrap.bundle")

class DegreeTable {
    constructor(majors, session) {
        this.element = document.createElement('table')
        this.element.className = 'table table-bordered'
        this.headerRow = new DegreeHeaderRow(majors)
        this.element.appendChild(this.headerRow.element)
        this.quarters = 12
        this.createBody(majors, session)
    }

    createBody(majors, session) {
        this.body = document.createElement('tbody')
        this.element.appendChild(this.body)
        this.quarterRows = []
        // all quarter row go inside this.body
        // for now there are 6 quarters. // TODO - make this not hard-coded
        for (let quarter = 0; quarter <= this.quarters; quarter++) {
            const classesByQuarter = this.getClassesByQuarter(majors, quarter)
            const quarterRow = new DegreeQuarterRow(quarter, classesByQuarter, session)
            this.quarterRows.push(quarterRow)
            this.body.appendChild(quarterRow.element)
        }
    }

    getClassesByQuarter(majors, quarter) {
        const output = {}
        // pull out the classes for all majors in a quarter
        Object.keys(majors).forEach((major) => {
            const classesByMajor = majors[major].quarters
            const classesByQuarter = classesByMajor.find((quarterClasses) => quarterClasses.quarter === quarter)
            if (classesByQuarter) {
                output[major] = classesByQuarter
            } else { // no classes found
                output[major] = {
                    quarter: quarter,
                    classes: []
                }
            }
        })
        return output
    }

}

// presents the header row in the table
class DegreeHeaderRow {
    constructor(majors) {
        this.element = document.createElement('thead')
        this.element.className = 'thead-dark'
        this.row = document.createElement('tr')
        this.element.appendChild(this.row)
        this.row.appendChild(this.headerCell('&nbsp;'))
        // create header for all majors
        Object.keys(majors).forEach((major) => {
            this.row.appendChild(this.headerCell(majors[major].name))
        })
    }

    headerCell(innerHTML) {
        const element = document.createElement('th')
        element.setAttribute('scope', 'col')
        element.innerHTML = innerHTML
        return element
    }
}

// represents the data row in the table
class DegreeQuarterRow {
    constructor(quarter, classesByQuarter, session) {
        this.quarter = quarter
        this.classesByQuarter = classesByQuarter
        this.element = document.createElement('tr')
        this.element.appendChild(this.headerCell(this.quarter === 0 ? `Degree Prerequisites` : `Quarter ${this.quarter}`))
        this.quarterCells = []
        this.appendAllMajors(classesByQuarter, session)
    }

    headerCell(innerHTML) {
        const element = document.createElement('th')
        element.setAttribute('scope', 'row')
        if (innerHTML) {
            element.innerHTML = innerHTML
        }
        return element
    }

    bodyCell(innerHTML) {
        const element = document.createElement('td')
        if (innerHTML) {
            element.innerHTML = innerHTML
        }
        return element
    }

    appendAllMajors(classesByQuarter, session) {
        Object.keys(classesByQuarter).forEach((major) => {
            const quarterCell = new DegreeQuarterCell(classesByQuarter[major], session)
            this.quarterCells.push(quarterCell)
            this.element.appendChild(quarterCell.element)
        })
    }
}

// represents the data cell in the table
class DegreeQuarterCell {
    constructor(majorQuarterClasses, session) {
        this.majorQuarterClasses = majorQuarterClasses
        this.element = document.createElement('td')
        this.classSelectors = []
        this.majorQuarterClasses.classes.forEach((classDetail) => {
            const classSelector = new ClassSelector(classDetail, session)
            this.classSelectors.push(classSelector)
            this.element.appendChild(classSelector.element)
        })
    }
}

// prereq vs alt
// prereq at class level & alt at degree level
// => there can be conflicts, we need additional logic to handle the degree-leel alternates to ensure
//    we can use it as prereq overrides
// prereq at class level & alt at class level
// => this is probably the easiest way... we need to handle the intersection of prereq & alt
// prereq at class level & alt at both class & degree level
// => this is a combination of the two above
// what happens when a class is a alternate of a prereq...

class ClassSelector {
    constructor(classDetail, session) {
        this.classDetail = classDetail
        this.session = session
        this.element = document.createElement('div')
        this.element.className = 'container rounded m-0 p-3'
        this.element.style.border = '0.3px solid gray'
        // check if there are alternates.
        // if there are alternates, then we pull in the alternate details.
        // this is C-1
        this.inner = new SingleClassSelector(classDetail, session)
        this.element.appendChild(this.inner.element)
        this.alts = this.classDetail.alts.map((alt) => {
            const orSeparator = document.createElement('div')
            orSeparator.innerHTML = '--or--'
            this.element.appendChild(orSeparator)
            const selector = new SingleClassSelector(alt, session, this.classDetail.classId)
            this.element.appendChild(selector.element)
            return selector
        })
        // we want the ability to pick one of them to equal being both of them.
        // C-0 is alt for C-1, so when picking C-0, we should also sent signal for picking C1.
    }
}

// represents each class
// white = selectable = btn-light
// gray = unselectable = btn-secondary
// green = selected = btn-success
class SingleClassSelector {
    constructor(classDetail, session, altClassId = undefined) {
        this.classDetail = classDetail // classId, name, prereqs
        this.session = session
        this.altClassId = altClassId
        this.session.subscribe('selectClass', (event) => {
            // if my class is selected, change to green
            if (classDetail.classId === event.detail.classId) {
                this.refreshState(true, this.selectable)
            }
            // if it's a prereq being selected. make this class selectable.
            else if (this.isPrereqSelected(event.detail.classId)) {
                this.setSelectableByUnfulfilledPrereqs()
                // console.log('***** a prereq is seleceted', event.detail.classId)
            }
            // post-req are the opposite of prereq
            else if (this.isThisAPostReqOfMyClass(event.detail.classId)) {
                // we need to disable the ability to unselect the class.
                // if one of our alternates is selected, we still want to be selectable
                const alternateSelected = this.isAlternateSelected()
                console.log('******* SingleClass.selector.alternate', this.classDetail.classId, alternateSelected)
                this.refreshState(this.selected, alternateSelected || false)
            }
        })
        this.session.subscribe('unselectClass', (event) => {
            // if my class is unselected, change to gray
            if (classDetail.classId === event.detail.classId) {
                this.refreshState(false, this.selectable)
            }
            // if it's a prereq being unselected. make this class unselectable.
            else if (this.isPrereqSelected(event.detail.classId)) {
                this.setSelectableByUnfulfilledPrereqs()
            }
            // post req
            else if (this.isThisAPostReqOfMyClass(event.detail.classId)) {
                // because there might be multiple post reqs
                // we only allow selection when all post reqs are unselected
                const selectable = this.isAnyPostReqSelected()
                this.refreshState(this.selected, !selectable)
            }
        })
        this.element = document.createElement('button')
        this.element.className = 'btn btn-large btn-block'
        this.element.style.border = '0.2px solid gray'
        this.element.setAttribute('data-container', 'body')
        this.element.setAttribute('data-toggle', 'popover')
        this.element.setAttribute('data-content', '<h1>this is a tooltip</h1>')
        // console.log('******* ClassSelector', classDetail, session)
        this.handleClick = this.handleClick.bind(this)
        this.element.innerHTML = this.classDetail.name
        this.setSelectableByUnfulfilledPrereqs()
        if (this.session.selectedClasses.find((clsId) => clsId === classDetail.classId)) {
            // we should also check if the postReq has been selected.
            const selectable = this.isAnyPostReqSelected()
            console.log('******* ClassSelector.isPostReqSelected', this.classDetail, selectable)
            this.refreshState(true, !selectable)
        }
    }

    handleClick(event) {
        event.preventDefault()
        event.stopPropagation()
        if (this.session['token']) { // logged in
            // TODO - implement selection logic.
            if (this.selected) {
                this.selectClass(false)
            } else {
                this.selectClass(true)
            }
        } else { // not logged in.
            alert('You need to login to select classes. Please login first.')
        }
    }

    resetPopover() {
        if (this.popover) {
            this.popover.disable()
            this.popover.dispose()
            delete this.popover
        }
    }

    openPopover() {
        this.resetPopover()
        this.popover = new bootstrap.Popover(this.element, {
            html: true,
            placement: 'auto',
            title: this.getUnfulfilledPrereqHtml(),
            trigger: 'hover'
        })
    }

    getUnfulfilledPrereqHtml() {
        const prereqs = this.getUnfulfilledPrereqs(this.classDetail)
        console.log('********** getUnfulfilledPrereqs', prereqs)
        const prereqsHtml = prereqs.map((prereq) => {
            return `<li>${prereq.names.join(' -or- ')}</li>`
        })
        return `<div><h5>Unfulfilled Prereqs</h5><ul>${prereqsHtml.join('\n')}</ul></div>`
    }

    isPrereqSelected(classId) {
        return this.classDetail.prereqs.find((prereq) => {
            return prereq.classIds.find((clsId) => classId === clsId)
        })
    }

    isAnyPostReqSelected() {
        const classes = this.session.loadPostReqClasses(this.classDetail.classId)
        const selected = classes.filter((cls) => {
            return this.session.selectedClasses.find((selected) => cls.classId == selected)
        })
        return selected.length > 0
    }

    isAlternateSelected() {
        return !!this.session.isAlternateSelected(this.classDetail.alts.map((alt) => {
            if (typeof(alt) === 'string') {
                return alt
            } else {
                return alt.classId
            }
        }))
    }

    isThisAPostReqOfMyClass(classId) {
        try {
            const classDetail = this.session.loadClassById(classId)
            // see if this object's class is a prereq of the selected class
            // based on the classId, get its prereqs.
            console.log('**** isThisAPostR')
            const prereq = classDetail.prereqs.find((prereq) => {

                return prereq.classIds.find((clsId) => clsId === this.classDetail.classId)
            })
            console.log('**** ClassSelector.isThisAPostReqOfMyClass', classId, classDetail, prereq)
            return !!prereq
        } catch (e) {
            console.error(`ClassSelector.isThisAPostReqOfMyClass:ERROR`, e)
            return false
        }
    }

    setSelectableByUnfulfilledPrereqs() {
        // if there is unfulfilled prereqs, it's not selectable, otherwise it's selectable.
        const unfulfilled = this.getUnfulfilledPrereqs(this.classDetail)
        // console.log('****** ClassSelector', this.classDetail, unfulfilled, unfulfilled.length > 0)
        if (unfulfilled.length > 0) {
            this.refreshState(this.selected, false)
        } else {
            this.refreshState(this.selected, true)
        }
    }    

    selectClass(selected) {
        if (selected) {
            this.session.selectClass(this.classDetail.classId)
        } else { // TODO we need to remove selected class
            this.session.unselectClass(this.classDetail.classId)
        }
        this.refreshState(selected, this.selectable)
    }

    // possible states of the button
    // green, active => selected, can be unselected (no postreqs are selected yet)
    // green, disabled => selected, cannot be unselected (because postreqs are selected)
    // white, active => not selected, can be selected (prereqs fulfilled)
    // gray, disabled => not selected, cannot be selected (prereqs unfulfilled)
    refreshState(selected, selectable) {
        this.selected = selected
        this.selectable = selectable
        if (selected === true) {
            if (selectable === true) { // green / active
                this.resetPopover()
                this.element.style.backgroundColor = 'palegreen'
                this.element.addEventListener('click', this.handleClick) // active for unselect
                this.element.style.cursor = 'pointer'
            } else { // green / disabled
                this.resetPopover()
                this.element.style.backgroundColor = 'palegreen'
                this.element.removeEventListener('click', this.handleClick) // disabled
                this.element.style.cursor = 'not-allowed'
            }
        } else {
            if (selectable === true || selectable === undefined) { // white / active
                this.resetPopover()
                this.element.style.backgroundColor = '#f8f8f8'
                this.element.addEventListener('click', this.handleClick) // active for select
                this.element.style.cursor = 'pointer'
            } else { // gray / disabled
                this.element.style.backgroundColor = 'lightgray'
                this.element.removeEventListener('click', this.handleClick) // disabled
                this.element.style.cursor = 'not-allowed'
                this.openPopover()
            }
        }
    }

    getUnfulfilledPrereqs(classDetail) {
        // TODO - add selected classes by students
        const selectedClasses = this.session.selectedClasses
        // remove all selectedClasses from the prereqs.
        const results = []
        classDetail.prereqs.forEach((prereq) => {
            console.log('******* getUnfulfilledPrerqeqs', classDetail.classId, prereq)
            const exists = this.session.selectedClasses.find((clsId) => {
                console.log('******* find', prereq.classIds)
                return prereq.classIds.find((prereqClassId) => prereqClassId === clsId)
            })
            if (!exists) {
                results.push(prereq)
            }
            // we want to map the unfulfilled prereqs into their equivalent classes.
        })
        console.log('******* getUnfulfilledPrereqs:results', results)
        const classes = results.map((prereq) => {
            const classes = prereq.classIds.map((clsId) => this.session.loadClassById(clsId))
            return {
                names: classes.map((cls) => cls.name)
            }
        })
        return classes
    }
}
