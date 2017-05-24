// SuperDate
{
  window.SuperDate = class SuperDate extends Date {
    beginningOfMonth() {
      return new SuperDate(this.getFullYear(), this.getMonth(), 1);
    }

    beginningOfDay() {
      return new SuperDate(this.getFullYear(), this.getMonth(), this.getDate(), 0, 0, 0, 0);
    }

    addDay() {
      return new SuperDate(
        this.getFullYear(),
        this.getMonth(),
        this.getDate() + 1,
        this.getHours(),
        this.getMinutes(),
        this.getSeconds(),
        this.getMilliseconds()
      );
    }

    addMonth() {
      return new SuperDate(
        this.getFullYear(),
        this.getMonth() + 1,
        this.getDate(),
        this.getHours(),
        this.getMinutes(),
        this.getSeconds(),
        this.getMilliseconds()
      );
    }

    subMonth() {
      return new SuperDate(
        this.getFullYear(),
        this.getMonth() - 1,
        this.getDate(),
        this.getHours(),
        this.getMinutes(),
        this.getSeconds(),
        this.getMilliseconds()
      );
    }

    equalsDate(date) {
      return (
        date &&
        this.getFullYear() === date.getFullYear() &&
        this.getMonth() === date.getMonth() &&
        this.getDate() === date.getDate()
      );
    }

    isAfter(date) {
      return (date && this.getTime() > date.getTime());
    }
  }
}