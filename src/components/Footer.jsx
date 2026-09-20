import pkg from '../../package.json';

export default function Footer() {
  return (
    <footer className="app-footer">
      Fast Cups v{pkg.version} · made by Roi Nathan
    </footer>
  );
}
