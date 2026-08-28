import express, { Request, Response } from 'express';
import fs from 'fs';

export default {
    // Lista todas as grades
    async listAllGrades(request: Request, response: Response) {
        let data = fs.readFileSync('./src/repositorio/grades.json', 'utf8');
        const grades = JSON.parse(data);
        const listGrades = grades.grades.sort((a: any, b: any) => a.id - b.id)
        return response.json({ listGrades });
    },

    async createGrade(request: Request, response: Response) {
        const { student, subject, type, value } = request.body;
        
        let data = fs.readFileSync('./src/repositorio/grades.json', 'utf8');
        const gradesAll = JSON.parse(data);
        let grades = gradesAll.grades;

        const newGrades = {
            id: gradesAll.nextId,
            student: student,
            subject: subject,
            type: type,
            value: value,
            timestamp: new Date()
        };

        const finalGrade = {
            nextId: gradesAll.nextId + 1,
            grades: [
              ...grades,
              newGrades
            ]
        };

        fs.writeFile('./src/repositorio/grades.json', JSON.stringify(finalGrade), function (err) {
            if (err) throw err;
            console.log('Updated!');
        });

        return response.json({ finalGrade });
    },

    async updateGrade(request: Request, response: Response) {
        const { id, student, subject, type, value } = request.body;
        var error = 'Grade with id ' + id + ' not found';

        let data = fs.readFileSync('./src/repositorio/grades.json', 'utf8');
        const gradesAll = JSON.parse(data);
        let grades = gradesAll.grades;

        const index = grades.findIndex((grade: any) => grade.id === id);

        if (index < 0) 
            return response.json({ error });
        
        const gradesNew = grades.filter((grade: any) => grade.id != id);

        const gradeData = {
            id: id,
            student: student,
            subject:subject,
            type: type,
            value: value,
            timestamp: new Date()
        }

        const finalGrade = {
            nextId: gradesAll.nextId,
            grades: [
              ...gradesNew,
              gradeData
            ]
        };
        
        fs.writeFileSync('./src/repositorio/grades.json', JSON.stringify(finalGrade));

        return response.json({ gradeData });
    },

    async deleteGrade(request: Request, response: Response) {
        const { id } = request.params;
        var error = 'Grade with id ' + id + ' not found';

        let data = fs.readFileSync('./src/repositorio/grades.json', 'utf8');
        const gradesAll = JSON.parse(data);
        let grades = gradesAll.grades;

        const index = grades.findIndex((grade: any) => grade.id === Number(id));

        if (index < 0) 
            return response.json({ error });
        
        const gradesNew = grades.filter((grade: any) => grade.id != Number(id));

        const finalGrade = {
            nextId: gradesAll.nextId,
            grades: [
              ...gradesNew
            ]
        };
        
        fs.writeFileSync('./src/repositorio/grades.json', JSON.stringify(finalGrade));

        return response.status(204).send();
    },

    async listGrade(request: Request, response: Response) {
        const { id } = request.params;
        let data = fs.readFileSync('./src/repositorio/grades.json', 'utf8');
        const grades = JSON.parse(data);
        const grade = grades.grades.filter((grade: any) => grade.id === Number(id));
        return response.json({ grade });
    },

    async totalGrade(request: Request, response: Response) {
        const { student, subject } = request.body;
        let data = fs.readFileSync('./src/repositorio/grades.json', 'utf8');
        const grades = JSON.parse(data);

        var notaTotal = 0;
        grades.grades.forEach((grade: any) => {
            if ((grade.student === student) && (grade.subject === subject)){
                notaTotal += grade.value;
            }
        });
            
        return response.json({ notaTotal });
    },

    async avgGrade(request: Request, response: Response) {
        const { subject, type } = request.body;
        let data = fs.readFileSync('./src/repositorio/grades.json', 'utf8');
        const grades = JSON.parse(data);
        var total = 0;
        var i = 0;

        grades.grades.forEach((grade: any) => {
            if ((grade.subject === subject) && (grade.type === type)){
                total += grade.value;
                i++;
            }
        });

        const avgSubject = total / i;
        return response.json({ avgSubject });
    },

    async avgTopThreeGrade(request: Request, response: Response) {
        const { subject, type } = request.body;
        let data = fs.readFileSync('./src/repositorio/grades.json', 'utf8');
        const grades = JSON.parse(data);
        
        var gradesAvg = grades.grades
            .sort((a: any, b: any) => b.value - a.value)
            .filter((grade: any) => (grade.subject === subject && grade.type === type))
            .slice(0, 3);

        return response.json({ gradesAvg });
    }
}
