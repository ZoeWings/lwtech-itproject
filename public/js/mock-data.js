const MOCK_CLASSES = [
    {
        "name": "CSD 112 HTML and CSS",
        "classId": 1,
        "prereqs": [],
		"alts": []
    },
    {
        "name": "CSD 122 JavaScript",
        "classId": 2,
        "prereqs": [9,1],
		"alts": []
    },
    {
        "name": "CSD 275 PHP Scripting",
        "classId": 3,
        "prereqs": [9,1],
		"alts": []
    },
    {
        "name": "CSD 111 Computer Programming Fundamentals",
        "classId": 4,
        "prereqs": [],
		"alts": []
    },
    {
        "name": "CS& 141 Computer Science I Java",
        "classId": 5,
        "prereqs": [9],
		"alts": []
    },
    {
        "name": "CS 143 Computer Science II Java",
        "classId": 6,
        "prereqs": [5],
		"alts": []
    },
    {
        "name": "CSD 233 C++ Programming",
        "classId": 7,
        "prereqs": [6],
		"alts": []
    },
    {
        "name": "CSD 228 Programming with C#",
        "classId": 8,
        "prereqs": [5],
		"alts": []
    },
    {
        "name": "CSD 110 Computer Programming Fundamentals with Python",
        "classId": 9,
        "prereqs": [],
		"alts": []
    },
    {
        "name": "SOC& 101 Introduction to Sociology",
        "classId": 10,
        "prereqs": [],
		"alts": [73]
    },
    {
        "name": "MATH 99 Intermediate Algebra",
        "classId": 11,
        "prereqs": [],
		"alts": []
    },
    {
        "name": "CSD 138 Structured Query Language (SQL)",
        "classId": 12,
        "prereqs": [9],
		"alts": []
    },
    {
        "name": "DSGN 122 Image Editing",
        "classId": 13,
        "prereqs": [],
		"alts": []
    },
    {
        "name": "ENGL& 235 Technical Writing",
        "classId": 14,
        "prereqs": [44],
		"alts": []
    },
    {
        "name": "CSD 268 Quality Assurance Methodologies",
        "classId": 15,
        "prereqs": [5],
		"alts": [57]
    },
    {
        "name": "DSGN 153 Introduction to Web and Mobile Design",
        "classId": 16,
        "prereqs": [13],
		"alts": []
    },
    {
        "name": "CSD, CSNT, DSGN, or GAME Technical Elective course",
        "classId": 17,
        "prereqs": [],
		"alts": []
    },
    {
        "name": "CSD 230 Programming For Mobile Devices",
        "classId": 18,
        "prereqs": [6,8],
		"alts": []
    },
    {
        "name": "CSD 297 IT Project",
        "classId": 19,
        "prereqs": [6],
		"alts": []
    },
    {
        "name": "MATH& 141 Pre-Calculus I",
        "classId": 20,
        "prereqs":[11],
		"alts": [80]
    },
    {
        "name": "ART 102 Design I",
        "classId": 21,
        "prereqs":[],
		"alts": [78]
    },
    {
        "name": "PHYS& 114 General Physics I w/Lab",
        "classId": 22,
        "prereqs":[11],
		"alts": [79]
    },
    {
        "name": "CSD 298 Technical Interview/Job Seach",
        "classId": 23,
        "prereqs":[6],
		"alts": [45]
    },
    {
        "name": "MATH& 151 Calculus I",
        "classId": 25,
        "prereqs":[56],
		"alts": []
    },
    {
        "name": "MATH& 152 Calculus II",
        "classId": 26,
        "prereqs":[25],
		"alts": []
    },
    {
        "name": "Humanities course",
        "classId": 27,
        "prereqs":[],
		"alts": []
    },
    {
        "name": "MATH& 163 Calculus III",
        "classId": 28,
        "prereqs":[26],
		"alts": []
    },
    {
        "name": "PHYS& 221 Engineering Physics I with Lab",
        "classId": 29,
        "prereqs":[56],
		"alts": []
    },
    {
        "name": "PSYC& 100 General Psychology",
        "classId": 30,
        "prereqs": [],
		"alts": []
    },
    {
        "name": "MATH& 264 Calculus IV",
        "classId": 31,
        "prereqs":[28],
		"alts": []
    },
    {
        "name": "PHYS& 222 Engineering Physics II with Lab",
        "classId": 32,
        "prereqs":[25,29],
		"alts": []
    },
    {
        "name": "PHIL& 120 Symbolic Logic",
        "classId": 33,
        "prereqs":[11],
		"alts": [78]
    },
    {
        "name": "Elective course (CSD 233 C++ Programming/MATH& 141 Pre-Calculus I recommended)",
        "classId": 35,
        "prereqs": [],
		"alts": []
    },
    {
        "name": "Elective course (MATH& 142 Pre-Calculus II may be used if taken previously)",
        "classId": 36,
        "prereqs": [],
		"alts": []
    },
    {
        "name": "College-level Social Science course",
        "classId": 37,
        "prereqs": [],
		"alts": []
    },
    {
        "name": "College-level Humanities course",
        "classId": 38,
        "prereqs": [],
		"alts": []
    },
    {
        "name": "DSGN 268 Introduction to Content Management Systems",
        "classId": 43,
        "prereqs":[1]
    },
    {
        "name": "ENGL& 101 English Composition I",
        "classId": 44,
        "prereqs": [],
		"alts": []
    },
    {
        "name": "DSGN 290 Portfolio/Job Search",
        "classId": 45,
        "prereqs":[21],
		"alts": []
    },
    {
        "name": "CSD 235 Algorithms and Data Structures",
        "classId": 46,
        "prereqs": [],
		"alts": [47, 48]
    },
    {
        "name": "CSD 294 Introduction to IoT",
        "classId": 47,
        "prereqs": [],
		"alts": []
    },
    {
        "name":"Any CSD, CSNT, DSGN, GAME course",
        "classId": 48,
        "prereqs": [],
		"alts": []
    },
    {
        "name":"MATH& 146 Introduction to Statistics",
        "classId": 49,
        "prereqs":[11],
		"alts": []
    },
    {
        "name":"ECON& 201 Micro Economics",
        "classId": 50,
        "prereqs":[11,44],
		"alts": [73]
    },
    {
        "name":"ENGL& 102 English Composition II",
        "classId":51,
        "prereqs":[44],
		"alts": [14]
    },
    {
        "name":"CMST& 220 Introduction to Public Speaking",
        "classId":52,
        "prereqs": [],
		"alts": []
    },
    {
        "name":"PHYS& 223 Engineering Physics III with Lab",
        "classId":53,
        "prereqs":[26, 32],
		"alts": []
    },
    {
        "name":"BIOL& 160 General Biology with Lab",
        "classId":54,
        "prereqs": [],
		"alts": []
    },
    {
        "name":"MATH 220 Linear Algebra",
        "classId":55,
        "prereqs":[56],
		"alts": []
    },
    {
        "name":"MATH& 142 Pre-Calculus II ",
        "classId":56,
        "prereqs": [20],
		"alts": [49]
    },
    {
        "name":"Academic Course",
        "classId":57,
        "prereqs": [],
		"alts": []
    },
    {
        "name":"Natural Sciences Course",
        "classId":58,
        "prereqs": [],
		"alts": []
    },
    {
        "name":"CSD 322 Computer and Network Architecture",
        "classId":59,
        "prereqs":[2,12,15],
		"alts": []
    },
    {
        "name":"CSD 323 Data Analytics",
        "classId":60,
        "prereqs": [],
		"alts": []
    },
    {
        "name":"CSD 331 Database Modeling and Design",
        "classId":61,
        "prereqs":[12,55],
		"alts": []
    },
    {
        "name":"CSD 332 Software Project Management",
        "classId":62,
        "prereqs": [],
		"alts": []
    },
    {
        "name":"CSD 335 Algorithms and Data Structures",
        "classId":63,
        "prereqs":[6],
		"alts": []
    },
    {
        "name":"CSD 412 Web Application Development",
        "classId":64,
        "prereqs":[2,61],
		"alts": []
    },
    {
        "name":"CSD 415 Operating Systems Concepts",
        "classId":65,
        "prereqs":[62],
		"alts": []
    },
    {
        "name":"CSD 425 Cloud Computing",
        "classId":66,
        "prereqs":[64],
		"alts": []
    },
    {
        "name":"CSD 436 Algorithmic Problem Solving for Interviews",
        "classId":67,
        "prereqs":[63],
		"alts": []
    },
    {
        "name":"CSD 438 Big Data Application Development",
        "classId":68,
        "prereqs":[61,66],
		"alts": []
    },
    {
        "name":"CSD 480 Capstone Project",
        "classId":69,
        "prereqs": [],
		"alts": []
    },
    {
        "name":"PSYC 324 Psychology of Organizations",
        "classId":70,
        "prereqs": [],
		"alts": []
    },
    {
        "name":"CS 101 Introduction to Computer Science",
        "classId":71,
        "prereqs": [],
		"alts": []
    },
    {
        "name":"HUM 215 Diversity and Social Justice in America",
        "classId":72,
        "prereqs":[44],
		"alts": [78]
    },
    {
        "name":"Any Social Sciences courses",
        "classId":73,
        "prereqs": [],
		"alts": []
    },
    {
        "name":"CS 170 Linear Algebra for Data Analysis",
        "classId":74,
        "prereqs": [],
		"alts": []
    },
    {
        "name":"CS 222 Computing, Data, and Society",
        "classId":75,
        "prereqs": [],
		"alts": []
    },
    {
        "name":"ENVS& 101 Introduction to Environmental Science",
        "classId":76,
        "prereqs": [],
		"alts": [79]
    },
    {
        "name":"Any college-level, transferable Quantitative Reasoning course",
        "classId":77,
        "prereqs": [],
		"alts": []
    },
    {
        "name":"Any Humanities course",
        "classId":78,
        "prereqs": [],
		"alts": []
    },
    {
        "name":"Any Natural Science course with a lab",
        "classId":79,
        "prereqs": [],
		"alts": []
    },
    {
        "name":"Any higher level course in the calculus sequence",
        "classId":80,
        "prereqs": [],
		"alts": []
    },
    {
        "name":"CS 102 Computer Science Careers/Student Success",
        "classId":81,
        "prereqs": [],
		"alts": []
    },
    {
        "name":"CS 243 Software Development Tools",
        "classId":82,
        "prereqs": [],
		"alts": []
    },
    {
        "name":"CS 296 Computer Science Career Seminar",
        "classId":83,
        "prereqs": [],
		"alts": []
    },
    {
        "name":"CS 202 Discrete Structures",
        "classId":84,
        "prereqs": [],
		"alts": []
    },
    {
        "name":"CS 301 Foundations of Computer Science",
        "classId":85,
        "prereqs": [],
		"alts": []
    },
    {
        "name":"CS 321 Database Systems",
        "classId":86,
        "prereqs": [],
		"alts": []
    },
    {
        "name":"CS 397 Computer Science Seminar I",
        "classId":87,
        "prereqs": [],
		"alts": []
    },
    {
        "name":"CS 302 Discrete Structures II",
        "classId":88,
        "prereqs": [],
		"alts": []
    },
    {
        "name":"CS 333 Data Structures and Algorithms",
        "classId":89,
        "prereqs": [],
		"alts": []
    },
    {
        "name":"CS 334 Data Structures & Algorithms II",
        "classId":90,
        "prereqs": [],
		"alts": []
    },
    {
        "name":"CS 350 Software Engineering",
        "classId":91,
        "prereqs": [],
		"alts": []
    },
    {
        "name":"CS 398 Computer Science Seminar II",
        "classId":92,
        "prereqs": [],
		"alts": []
    },
    {
        "name":"CS 421 Algorithmic Problem Solving",
        "classId":93,
        "prereqs": [],
		"alts": []
    },
    {
        "name":"CS 442 Principles of Computer Systems",
        "classId":94,
        "prereqs": [],
		"alts": []
    },
    {
        "name":"CS 450 Security Foundations",
        "classId":95,
        "prereqs": [],
		"alts": []
    },
    {
        "name":"CS 498 Computer Science Seminar III",
        "classId":96,
        "prereqs": [],
		"alts": []
    },
    {
        "name":"CSD 485 Capstone Project I",
        "classId":97,
        "prereqs": [],
		"alts": []
    },
    {
        "name":"CS 433 Programming Languages",
        "classId":98,
        "prereqs": [],
		"alts": []
    },
    {
        "name":"Any Technical Elective course",
        "classId":99,
        "prereqs": [],
		"alts": []
    },
    {
        "name":"CS 402 Statistical Methods for Testing",
        "classId":100,
        "prereqs": [],
		"alts": []
    },
    {
        "name":"CS 486 Capstone Project II",
        "classId":101,
        "prereqs": [],
		"alts": []
    }
    
]

const MOCK_MAJORS = [
    {
        "degreeId": "AAS-T",
        "name": "Computing and Software Development, AAS-T",
        "quarters": [
            {
                "quarter": 0,
                "classes": [
                    {
                        "classId": 11
                    }
                ]
            },
            {
                "quarter": 1,
                "classes": [
                    {
                        "classId": 9
                    },
                    {
                        "classId": 1
                    },
                    {
                        "classId": 44
                    }
                ]
            },
            {
                "quarter": 2,
                "classes": [
                    {
                        "classId": 5
                    },
                    {
                        "classId": 2
                    },
                    {
                        "classId": 12
                    }
                ]
            },
            {
                "quarter": 3,
                "classes": [
                    {
                        "classId": 6
                    },
                    {
                        "classId": 15
                    },
                    {
                        "classId": 20
                    }
                ]
            },
            {
                "quarter": 4,
                "classes": [
                    {
                        "classId": 8
                    },
                    {
                        "classId": 21
                    },
                    {
                        "classId": 22
                    },
                    {
                        "classId": 10
                    }
                ]
            },
            {
                "quarter": 5,
                "classes": [
                    {
                        "classId": 18
                    },
                    {
                        "classId": 3
                    },
                    {
                        "classId": 7
                    }
                ]
            },
            {
                "quarter": 6,
                "classes": [
                    {
                        "classId": 8
                    },
                    {
                        "classId": 23
                    },
                    {
                        "classId": 19
                    },
                    {
                        "classId": 46
                    }
                ]
            }
        ]
    },
    {
        "degreeId": "BAS",
        "name": "Information Technology: Computing and Software Development, BAS",
        "quarters": [
            {
                "quarter": 0,
                "classes": [
                    {
                        "classId": 11
                    },
                    {
                        "classId": 20
                    },
                    {
                        "classId": 1
                    },
                    {
                        "classId": 9
                    },
                    {
                        "classId": 5
                    },
                    {
                        "classId": 44
                    },
                    {
                        "classId": 37
                    },
                    {
                        "classId": 38
                    },
                    {
                        "classId": 56
                    },
                    {
                        "classId": 6
                    }
                ]
            },
            {
                "quarter": 1,
                "classes": [
                    {
                        "classId": 2
                    },
                    {
                        "classId": 12
                    },
                    {
                        "classId": 15
                    },
                    {
                        "classId": 25
                    },
                    {
                        "classId": 27
                    },
                    {
                        "classId": 58
                    }
                ]
            },
            {
                "quarter": 2,
                "classes": [
                    {
                        "classId": 59
                    },
                    {
                        "classId": 60
                    },
                    {
                        "classId": 55
                    }
                ]
            },
            {
                "quarter": 3,
                "classes": [
                    {
                        "classId": 61
                    },
                    {
                        "classId": 62
                    },
                    {
                        "classId": 63
                    }
                ]
            },
            {
                "quarter": 4,
                "classes": [
                    {
                        "classId": 64
                    },
                    {
                        "classId": 65
                    },
                    {
                        "classId": 14
                    }
                ]
            },
            {
                "quarter": 5,
                "classes": [
                    {
                        "classId": 66
                    },
                    {
                        "classId": 67
                    },
                    {
                        "classId": 22
                    }
                ]
            },
            {
                "quarter": 6,
                "classes": [
                    {
                        "classId": 68
                    },
                    {
                        "classId": 69
                    },
                    {
                        "classId": 70
                    }
                ]
            }
        ]
    },
    {
        "degreeId": "BS",
        "name": "Computer Science, BS",
        "quarters": [
            {
                "quarter": 0,
                "classes": [
                    {
                        "classId": 11
                    }
                ]
            },
            {
                "quarter": 1,
                "classes": [
                    {
                        "classId": 71
                    },
                    {
                        "classId": 44
                    },
                    {
                        "classId": 10
                    }
                ]
            },
            {
                "quarter": 2,
                "classes": [
                    {
                        "classId": 1
                    },
                    {
                        "classId": 72
                    },
                    {
                        "classId": 81
                    },
                    {
                        "classId": 20
                    }
                ]
            },
            {
                "quarter": 3,
                "classes": [
                    {
                        "classId": 9
                    },
                    {
                        "classId": 51
                    },
                    {
                        "classId": 56
                    },
                    {
                        "classId": 50
                    }
                ]
            },
            {
                "quarter": 4,
                "classes": [
                    {
                        "classId": 2
                    },
                    {
                        "classId": 55
                    },
                    {
                        "classId": 74
                    },
                    {
                        "classId": 22
                    }
                ]
            },
            {
                "quarter": 5,
                "classes": [
                    {
                        "classId": 12
                    },
                    {
                        "classId": 5
                    },
                    {
                        "classId": 75
                    },
                    {
                        "classId": 76
                    }
                ]
            },
            {
                "quarter": 6,
                "classes": [
                    {
                        "classId": 6
                    },
                    {
                        "classId": 7
                    },
                    {
                        "classId": 82
                    },
                    {
                        "classId": 83
                    }
                ]
            },
            {
                "quarter": 7,
                "classes": [
                    {
                        "classId": 84
                    },
                    {
                        "classId": 85
                    },
                    {
                        "classId": 86
                    },
                    {
                        "classId": 87
                    }
                ]
            },
            {
                "quarter": 8,
                "classes": [
                    {
                        "classId": 88
                    },
                    {
                        "classId": 89
                    },
                    {
                        "classId": 33
                    }
                ]
            },
            {
                "quarter": 9,
                "classes": [
                    {
                        "classId": 61
                    },
                    {
                        "classId": 90
                    },
                    {
                        "classId": 91
                    },
                    {
                        "classId": 92
                    },
                    {
                        "classId": 60
                    }
                ]
            },
            {
                "quarter": 10,
                "classes": [
                    {
                        "classId": 64
                    },
                    {
                        "classId": 93
                    },
                    {
                        "classId": 94
                    },
                    {
                        "classId": 95
                    },
                    {
                        "classId": 96
                    }
                ]
            },
            {
                "quarter": 11,
                "classes": [
                    {
                        "classId": 97
                    },
                    {
                        "classId": 98
                    },
                    {
                        "classId": 66
                    }
                ]
            },
            {
                "quarter": 12,
                "classes": [
                    {
                        "classId": 100
                    },
                    {
                        "classId": 101
                    },
                    {
                        "classId": 68
                    }
                ]
            }
        ]
    }
]