import { usePromiseTracker } from "react-promise-tracker";

const useLoading = (area: string) => {
    const { promiseInProgress } = usePromiseTracker({ area });
    return promiseInProgress;
}

export default useLoading;