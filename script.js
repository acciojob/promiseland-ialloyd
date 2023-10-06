class CustomPromise {
    constructor(executor) {
        this.promiseChain = [];
        this.handleError = () => {};

        this.onResolve = this.onResolve.bind(this);
        this.onReject = this.onReject.bind(this);

        try {
            executor(this.onResolve, this.onReject);
        } catch (error) {
            this.promiseChain = [];
            this.onReject(error);
        }
    }

    then(onResolve) {
        this.promiseChain.push(onResolve);

        return this;
    }

    catch(handleError) {
        this.handleError = handleError;

        return this;
    }

    finally(onFinally) {
        const noop = () => {};
        const onFinallyRejectionHandler = () => onFinally().then(() => { throw reason });
        
        return this.then(onFinally, onFinallyRejectionHandler);
    }

    onResolve(value) {
        let storedValue = value;

        try {
            this.promiseChain.forEach((nextFunction) => {
                storedValue = nextFunction(storedValue);
            });
        } catch (error) {
            this.promiseChain = [];

            this.onReject(error);
        }
    }

    onReject(error) {
        this.handleError(error);
    }
}













window.CustomPromise = CustomPromise;
