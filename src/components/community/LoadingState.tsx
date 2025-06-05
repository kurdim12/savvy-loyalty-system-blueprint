
interface LoadingStateProps {
  message?: string;
}

export const LoadingState = ({ message = "Loading..." }: LoadingStateProps) => {
  return (
    <div className="flex justify-center py-12">
      <div className="text-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#95A5A6] border-t-transparent mx-auto mb-4"></div>
        <p className="text-[#95A5A6]">{message}</p>
      </div>
    </div>
  );
};
