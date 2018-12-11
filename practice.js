// 1. Khai báo mảng chứa các object sinh viên chứa thông tin:
// {name, age, isFemale}
// Viết hàm thêm mới sinh viên vào mảng đó.
// Viết hàm lấy sinh viên theo vị trí trong mảng.
// Viết hàm trả về vị trí của sinh viên theo name.
// Viết hàm xóa một sinh viên trong mảng theo name.
// Hàm sử dụng static.

const listSinhVien = [];
class SinhVien {
    static addSinhVien(student) {
        listSinhVien.push(student);
    }

    static getStudentByIndex(index) {
        let result = -1;
        listSinhVien.map((item, key) => {
            if (key === index) {
                console.log('Student ', key, item);
                result = key;
            }
        });
        if (result < 0) {
            console.log('Student ', index, 'not found!');
        }
    }

    static getIndexOfStudentByName(name) {
        let result = -1;
        listSinhVien.map((item, key) => {
            if (item.name === name) {
                console.log('Index of student ', name, 'is', key);
                result = key;
            }
        });
        if (result < 0) {
            console.log('Student ', name, 'not found!');
        }
    }

    static deleteStudent(name) {
        let result = -1;
        listSinhVien.map((item, key) => {
            if (item.name === name) {
                result = key;
                listSinhVien.splice(key, 1);
                return result;
            }
        });
        return result;
    }

    static showStudent() {
        listSinhVien.length > 0 
        ? (
            console.log('Class:'),
            listSinhVien.map((item, key) => {
                console.log('\tStudent ', key, item);
            })
          )
        : console.log('Class have not student!');
    }
}

//Data
const sv1 = { name: 'A', age: 20, isFemale: true };
const sv2 = { name: 'B', age: 20, isFemale: true };
const sv3 = { name: 'C', age: 20, isFemale: true };
const sv4 = { name: 'D', age: 20, isFemale: true };
const sv5 = { name: 'E', age: 20, isFemale: true };

//Add student
SinhVien.addSinhVien(sv1);
SinhVien.addSinhVien(sv2);
SinhVien.addSinhVien(sv3);
SinhVien.addSinhVien(sv4);
SinhVien.addSinhVien(sv5);
SinhVien.showStudent();
console.log('\r');
// Trả về vị trí của sinh viên theo name.
console.log('----------Get index by name----------');
SinhVien.getIndexOfStudentByName('G');
console.log('\r');

// Viết hàm lấy sinh viên theo vị trí trong mảng.
console.log('----------Get student by index----------');
SinhVien.getStudentByIndex(0);
console.log('\r');

// Viết hàm xóa một sinh viên trong mảng theo name.
console.log('----------Delete student by name----------');
SinhVien.deleteStudent('E') < 0 
    ? console.log('Student not found!')
    : (
        console.log('Delete success!'),
        SinhVien.showStudent()
      );