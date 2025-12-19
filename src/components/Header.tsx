
const Header = ({ title }: { title: string }) => {
    return (
        <div className="w-fit mx-auto">
            <h1 className="text-3xl font-bold ">{title}</h1>
        </div>

    );
};

export default Header;