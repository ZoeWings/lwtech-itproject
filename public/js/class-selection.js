// each class represents an UI element
// each class creates / holds an HTML element
// each class will create / hold child components

class DegreeTable {
    constructor(majors, session) {
        this.element = document.createElement('table')
        this.element.className = 'table table-striped'
        this.headerRow = new DegreeHeaderRow(majors)
        this.element.appendChild(this.headerRow.element)
        this.quarters = 6
        this.createBody(majors, session)
    }

    createBody(majors, session) {
        this.body = document.createElement('tbody')
        this.element.appendChild(this.body)
        this.quarterRows = []
        // all quarter row go inside this.body
        // for now there are 6 quarters. // TODO - make this not hard-coded
        for (let quarter = 1; quarter <= this.quarters; quarter++) {
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
            const classesByMajor = majors[major].classes
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
        this.element.appendChild(this.headerCell('&nbsp;'))
        // create header for all majors
        Object.keys(majors).forEach((major) => {
            this.element.appendChild(this.headerCell(majors[major].major))
        })
    }

    headerCell(innerHTML) {
        const element = document.createElement('th')
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
        this.element.appendChild(this.bodyCell(`Quarter ${this.quarter}`))
        this.quarterCells = []
        this.appendAllMajors(classesByQuarter, session)
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

// represents each class
// white = selectable = btn-light
// gray = unselectable = btn-secondary
// green = selected = btn-success
class ClassSelector {
    constructor(classDetail, session) {
        this.classDetail = classDetail // classId, name, prereqs
        this.session = session
        this.session.subscribe('selectClass', (event) => {
            console.log('********** ClassSelector.event',classDetail, event.detail.classId)
            if (classDetail.classId === event.detail.classId) {
                this.setSelected(true)
            }
        })
        this.session.subscribe('unselectClass', (event) => {
            if (classDetail.classId === event.detail.classId) {
                this.setSelected(false)
            }
        })
        this.element = document.createElement('button')
        // console.log('******* ClassSelector', classDetail, session)
        this.element.addEventListener('click', (event) => {
            event.preventDefault()
            event.stopPropagation()
            if (session['token']) { // logged in
                // TODO - implement selection logic.
                if (this.selected) {
                    this.selectClass(false)
                } else {
                    this.selectClass(true)
                }
            } else { // not logged in.
                alert('You need to login to select classes. Please login first.')
            }
        })
        this.element.innerHTML = this.classDetail.name
        this.setSelectableByUnfulfilledPrereqs()
        if (this.session.selectedClasses.find((clsId) => clsId === classDetail.classId)) {
            this.setSelected(true)
        }
    }

    setSelectableByUnfulfilledPrereqs() {
        // if there is unfulfilled prereqs, it's not selectable, otherwise it's selectable.
        const unfulfilled = this.getUnfulfilledPrereqs(this.classDetail)
        // console.log('****** ClassSelector', this.classDetail, unfulfilled, unfulfilled.length > 0)
        if (unfulfilled.length > 0) {
            this.setSelectable(false)
        } else {
            this.setSelectable(true)
        }
    }    

    selectClass(selected) {
        if (selected) {
            this.session.selectClass(this.classDetail.classId)
        } else { // TODO we need to remove selected class
            this.session.unselectClass(this.classDetail.classId)
        }
        this.setSelected(selected)
    }

    setSelected(selected) {
        this.selected = selected
        if (this.selected) {
            this.element.className = 'btn btn-success'
        } else { // we need to return back to either selectable, or non-selectable.
            this.setSelectableByUnfulfilledPrereqs()
        }

    }

    getUnfulfilledPrereqs(classDetail) {
        // TODO - add selected classes by students
        return classDetail.prereqs
    }

    setSelectable(value) {
        if (value === true) { // selectable
            this.element.className = 'btn btn-light' // white
            this.element.removeAttribute('disabled')
        } else {
            this.element.className = 'btn btn-secondary' // gray
            this.element.setAttribute('disabled', 'true')
        }
    }
}
