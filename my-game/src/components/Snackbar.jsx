function Snackbar({ message }) {
  return (
    <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-slate-900 px-4 py-2 rounded-2xl text-white">
      {message}
    </div>
  );
}
export default Snackbar;
