const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const Employee = mongoose.model('Employee');

router.get('/', (req, res) => {
    res.render('employee/addOrEdit', {
        viewTitle: "Insert Employee"
    })
});

router.get('/list', (req, res) => {
    // res.json('from list');
    Employee.find((err, docs) => {
        if (! err) {
            res.render('employee/list', {
                list: docs
            })
        } else {
            console.log('Error in retrieving employee list: ' + err);
        }
    })
});

router.get('/delete/:id', (req, res) => {
    Employee.findByIdAndRemove(req.params.id, (err, doc) => {
        if (! err) {
            res.redirect('/employee/list');
        } else {
            console.log('Error in employee delete: ' + err);
        }
    })
});

router.get('/:id', (req, res) => {
    Employee.findById(req.params.id, (err, doc) => {
        if (! err) {
            res.render('employee/addOrEdit', {
                viewTitle: "Update Employee",
                employee: doc
            });
        } else {
            
        }
    })
})

router.post('/', (req, res) => {
    if (req.body._id == '') {
        insertRecord(req, res);
    } else {
        updateRecord(req, res);
    }
});

function insertRecord(req, res) {
    var employee = new Employee();
    employee.fullName = req.body.fullName;
    employee.email = req.body.email;
    employee.phoneNumber = req.body.phoneNumber;
    employee.city = req.body.city;
    employee.save((err, doc) => {
        if (! err) {
            res.redirect('employee/list');
        } else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                router.get('/', (req, res) => {
                    res.render('employee/addOrEdit', {
                        viewTitle: "Insert Employee",
                        employee: req.body
                    })
                });
            } else {
                console.log('Error during record insertion: ' + err);
            }
        }
    });
}

function updateRecord(req, res) {
    Employee.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true }, (err, doc) => {
        if (! err) {
            res.redirect('employee/list');
        } else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render('employee/addOrEdit', {
                    viewTitle: 'Update Employee',
                    employee: req.body
                });
            } else {
                console.log('Error during record update: ' + err);
                
            }
        }
    })
}

function handleValidationError(err, body) {
    for(field in err.errors) {
        switch (err.errors[field].path) {
            case 'fullName':
                body['fullNameError'] = err.errors[field].message;
                break;
            default:
                break;
        }
    }
}

module.exports = router;