import FileUpload from "./_components/file-upload";

export default function Home() {
  return (
    <div className="flex justify-center items-center container mx-auto h-[calc(100vh-30vh)]">
      <FileUpload />
    </div>
  );
}
